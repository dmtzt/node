const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.use(express.static('public'))

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '/app', 'index.html'))
// })

app.all('*', (req, res) => {
    res.status(404).send('resource not found')
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})