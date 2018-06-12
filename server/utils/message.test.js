let expect = require('expect')

let {generateMessage} = require('./message')

describe('generateMessage', () => {
    it('Should generate the correct message object', () => {
        let res = generateMessage('chris', 'test text')
        
        expect(res.from).toBe('chris')
        expect(res.text).toBe('test text')
        expect(typeof res.createdAt).toBe('number')
    })
})