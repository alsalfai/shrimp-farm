const path = require('path')
const express = require('express')
const hbs = require('hbs')
const mongooseConnect = require('./db/mongoose');
const farmRouter = require('./routers/farm')
const pondRouter = require('./routers/pond')

const app = express()
const port = 3000

mongooseConnect.dbconnect().on('error', (err) => console.log("connection to db failed"))

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, "../templates/views"))
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.json())
app.use(farmRouter)
app.use(pondRouter)

hbs.registerPartials(path.join(__dirname, "../templates/partials"))

app.get('/', (req, res) => res.render("index"))
app.get('*', (req, res) => res.render("notfound"))

app.listen(port, () => {
    console.log("shrip-farm is up and running on port " + port)
})
