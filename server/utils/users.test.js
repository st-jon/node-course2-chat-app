const expect = require('expect')
const {Users} = require('./users')


describe('Users', () => {

    let users

    beforeEach(() => {
        users = new Users()
        users.users = [{
            id: '1',
            name: 'Chris',
            room: 'Node course'
        }, {
            id: '2',
            name: 'Caro',
            room: 'React course'
        }, {
            id: '3',
            name: 'Eliott',
            room: 'Node course'
        }]
    })

    it('Should add new user', () => {
        let users = new Users()
        let user = {
            id: 123,
            name: 'chris',
            room: 'the office fans'
        }
        let resUser = users.addUser(user.id, user.name, user.room)

        expect(users.users).toEqual([user])
    })

    it('Should remove a user', () => {
       let userId = '1'
       let user = users.removeUser(userId)

       expect(user.id).toBe(userId)
       expect(users.users.length).toBe(2)
    })

    it('Should not remove a user', () => {
       let userId = '4'
       let user = users.removeUser(userId)

       expect(user).toBeFalsy()
       expect(users.users.length).toBe(3)
    })

    it('Should find user', () => {
        let userId = '2'
        let user = users.getUser(userId)

        expect(user.id).toBe(userId)
    })

    it('Should not find user', () => {
        let userId = '4'
        let user = users.getUser(userId)

        expect(user).toBe(undefined)

    })

    it('Should return names for node course', () => {
        let userList = users.getUserList('Node course')

        expect(userList).toEqual(['Chris', 'Eliott'])
    })

    it('Should return names for React course', () => {
        let userList = users.getUserList('React course')

        expect(userList).toEqual(['Caro'])
    })
 
})