class Users {
    constructor () {
        this.users = []
    }
    addUser(id, name, room) {
        let user = {id, name, room}
        this.users.push(user)
        return user
    }
    removeUser(id) {
         let user = this.users.filter(user => user.id === id)[0]
         if (user) {
            this.users = this.users.filter((user) => user.id !== id)
         }
         return user
    }
    getUser(id) {
        return this.users.filter((user) => user.id === id)[0]
    }
    getUserList(room) {
        let users = this.users.filter((user) => user.room === room)
        let namesArray = users.map((user) => user.name)

        return namesArray
    }
    isUniqueUser (room, name) {
		let roomUsersList = this.getUserList(room)
		let dublicated = roomUsersList.filter((user) => user.toUpperCase() === name.toUpperCase())

		return dublicated.length ? false : true
    }
   
}

module.exports = {
    Users
}