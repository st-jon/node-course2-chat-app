class Rooms {
    constructor () {
        this.rooms = []
    }
    addRoom(room) {
        let isRoom = this.rooms.filter((r) => r === room)
        if (isRoom.length === 1) {
            return
        } else {
            this.rooms.push(room)
        }
    }
    removeRoom(room, users) {
        let removedRoom = this.rooms.filter(r => r === room)[0]
        if (removedRoom) {
            if (users) {
                return
            } else {
                this.rooms = this.rooms.filter((room) => room !== removedRoom) 
            }
        }
    }
    getRoomList() {
        return this.rooms
    }
}

module.exports =  {
    Rooms
 }