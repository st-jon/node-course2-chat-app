const path = require('path')
const express = require('express')

const publicPath = path.join(__dirname, '../public')

let app = express()
const port = 3000

app.use(express.static(publicPath))


app.listen(port, () => {
    console.log(`Server Up on port ${port}`)
})


module.exports = {
    app
}