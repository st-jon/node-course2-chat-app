require('./config/config')

const path = require('path')
const http = require('http')
const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const socketIO = require('socket.io')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
let methodOverride = require('method-override')
const {ObjectID} = require('mongodb')

const {generateMessage, generateLocationMessage} = require('./utils/message')
const {isRealString} = require('./utils/validation')
let {mongoose} = require('./db/mongoose')
const {Users} = require('./utils/users')
const {Rooms} = require('./utils/rooms')
let {User} = require('./models/user')
let {authenticate} = require ('./middleware/authenticate')

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000
let app = express()
let server = http.createServer(app)
let io = socketIO(server)
let users = new Users()
let rooms = new Rooms()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(flash())
app.use(methodOverride('_method'))

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.post('/signup', async (req, res) => {
    try {
        const body = _.pick(req.body, ['name', 'email', 'password'])
        const user = new User(body)
        await user.save()
        const token = await user.generateAuthToken()
        res.cookie('x-auth', token).header('x-auth', token).render('join', {message: 'You have been signed-up and logged in', name: user.name})
    } catch(e) {
        res.status(400).render('signup', {message: 'Something went terribly wrong, please try again !'})
    }
})

app.post('/login', async (req, res) => {
try {
    const body = _.pick(req.body, ['email', 'password'])
    const user = await User.findByCredentials(body.email, body.password)
    const token = await user.generateAuthToken()
    console.log(user)
    res.cookie('x-auth', token).header('x-auth', token).render('join', {message: 'You are logged in', name: user.name})
} catch(e) {
    res.status(400).render('index', {message: 'Please try again or sign-up !'})
}
})

app.get('/join', async (req, res) => {
try {
    let token = req.cookies['x-auth']
    const user = await User.findByToken(token)
    res.send('join')
} catch(e) {
    res.status(400).render('index', {message: 'You must be logged in to enter !'})
}
})

app.get('/chat.html', async (req, res) => {
    try {
        let token = req.cookies['x-auth']
        const user = await User.findByToken(token)
        res.render('chat')
    } catch(e) {
        res.status(400).render('index', {message: 'You must be logged in to enter !'})
    }
    })

app.delete('/logout', authenticate, async (req, res) => {
try {
    await req.user.removeToken(req.token)
    res.status(200).clearCookie('x-auth', req.token).render('index', {message: 'You have been logged out'})
} catch(e) {
    res.status(400)('index', {message: 'uh-oh ... '})
}
})

app.use(express.static(publicPath))


io.on('connection', (socket) => {
    console.log('New user connected')

    socket.emit('UpdateRoomList', rooms.getRoomList())
        

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and Room name are Required')
        } 
        if (!users.isUniqueUser(params.room, params.name)) {
            return callback(`User's name already exist`)
        }

        rooms.addRoom(params.room)
        
        socket.join(params.room)
        users.removeUser(socket.id)
        users.addUser(socket.id, params.name, params.room)

        io.to(params.room).emit('updateUserList', users.getUserList(params.room))
        socket.emit('newMessage', generateMessage('Admin', `welcome to the ${params.room} Chat`))
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has join the room`))
    })
    
    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id)
        if(user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text))
        }
        
        callback()
    })

    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id)
        if(user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
        }
    })

    socket.on('userType', (message) => {
      
        io.in(message.room).emit('userTyping', {
            text: `${message.name} is typing ...`,
            name: message.name,
        })  
    })

    socket.on('userDoneType', () => {
        let user = users.getUser(socket.id)
        io.in(user.room).emit('userDoneTyping', {
            text: `${user.name}`,
            name: user.name,
        })  
    })

    socket.on('disconnect', () => {
        console.log('User disconnected')
        let user = users.removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room))
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`))
            
            rooms.removeRoom(user.room, users.getUserList(user.room).length)
            
        }
        
       
    })
})


server.listen(port, () => {
    console.log(`Server Up on port ${port}`)
})


module.exports = {
    app
}