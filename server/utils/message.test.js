let expect = require('expect')

let {generateMessage, generateLocationMessage} = require('./message')

describe('generateMessage', () => {
    it('Should generate the correct message object', () => {
        let res = generateMessage('chris', 'test text')

        expect(res.from).toBe('chris')
        expect(res.text).toBe('test text')
        expect(typeof res.createdAt).toBe('number')
    })
})

describe('generateLocationMessage', () => {
    it('Should generate the correct location message', () => {
        let res = generateLocationMessage('chris', 1, 1)

        expect(res.from).toBe('chris')
        expect(typeof res.createdAt).toBe('number')
        expect(res.url).toBe('https://www.google.com/maps?q=1,1')
    })
})