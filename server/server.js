const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const {generateMessage, generateLocationMessage} = require('./utils/message')
const {isRealString} = require('./utils/validation')
const {Users} = require('./utils/users')
const {Rooms} = require('./utils/rooms')

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000
let app = express()
let server = http.createServer(app)
let io = socketIO(server)
let users = new Users()
let rooms = new Rooms()

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('New user connected')

    socket.emit('UpdateRoomList', rooms.getRoomList())
        

    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and Room name are Required')
        } 
        if( !users.isUniqueUser(params.room, params.name)) {
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