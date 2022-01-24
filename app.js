const express = require('express')
const path = require('path')
const app = express()
const morgan = require('morgan')
// const logger  = require('./logger')
// const authorize = require('./authorize')
const port = 3000
const {products} = require('./data')
let {people} = require('./data')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
// app.use('/api', logger)
// app.use([authorize, logger])
app.use(morgan('tiny'))


// app.get('/', (req, res) => {
//     res.send('Home')
// })

app.get('/about', (req, res) => {
    res.send('About')
})

app.get('/api/people', (req, res) => {
    res.status(200).json({success: true, data: people})
})

app.post('/api/people', (req, res) => {
    const {name} = req.body
    if (!name)
        return res.status(400).json({success:false, msg:'please provide name value'})
    else
        res.status(201).send({success: true, person: name})
})

app.post('/login', (req, res) => {
    const {name} = req.body
    if (name)
        return res.status(200).send(`Welcome, ${name}`)
    else
        return res.status(401).send('Please provide credentials')
})

app.get('/api/products', (req, res) => {
    const newProducts = products.map((product) => {
        const {id, name, image} = product
        return {id, name, image}
    })

    res.json(newProducts)
})

app.get('/api/products/:id', (req, res) => {
    const singleProduct = products.find(
        (product) => product.id == req.params.id)

    if (!singleProduct)
        return res.status(404).send('Product does not exist')

    return res.json(singleProduct)
})

app.get('/api/v1/query', (req, res) => {
    // console.log(req.query)
    const {search, limit} = req.query
    let sortedProducts = [...products]

    if (search) {
        sortedProducts = sortedProducts.filter((product) => {
            return product.name.includes(search)
        })
    }
    if (limit) {
        sortedProducts = sortedProducts.slice(0, Number(limit))
    }
    
    if (sortedProducts.length < 1)
        // res.status(200).send('no products matched your search')
        return res.status(200).json({success: true, data: []})

    res.status(200).json(sortedProducts)
})

app.all('*', (req, res) => {
    res.status(404).send('resource not found')
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})