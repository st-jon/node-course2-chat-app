let {User} = require('./../models/user')

let authenticate = (req, res, next) => {
    let token = req.cookies['x-auth']
    console.log(token)
    User.findByToken(token).then((user) => {
        if(!user) {
            return Promise.reject()
        }

        req.user = user
        req.token = token
        next()
    }).catch((e) => {
        res.status(401).send()
    })
}

module.exports = {
    authenticate
}