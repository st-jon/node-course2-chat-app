const expect = require('expect')
const {isRealString} = require('./validation')

describe('isRealString', () => {
    it('Should reject non-string value', () => {
        let res = isRealString(123)

        expect(res).toBe(false)
    })

    it('Should reject string with only spaces', () => {
        let res = isRealString('   ')

        expect(res).toBe(false)
    })

    it('Should allow string with non space character', () => {
        let res = isRealString('  azuyri ')

        expect(res).toBe(true)
    })
})