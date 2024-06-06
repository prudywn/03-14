//Middleware -- anything between the request and response
require('dotenv').config();
const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const {logger} = require('./middleware/logEvent')
const errorHandler  = require('./middleware/errorHandler')
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const PORT = process.eventNames.PORT || 3500

// Connect to MongoDB
connectDB()



//custom middleware logger

app.use(logger)

app.use(credentials)
//Cross Origin Resource Sharing

app.use(cors(corsOptions))

//built-in middleware to handle urlencoded data(form-data)
app.use(express.urlencoded({ extended: true }))

//built-in middleware to handle json data
app.use(express.json())

//middleware for cookies
app.use(cookieParser())

//serve static files eg.images
app.use('/', express.static(path.join(__dirname, '/public')))

//route requests from the subdir to the router
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))

app.use(verifyJWT)
app.use('/employees',require('./routes/api/employees'))

app.all('*', (req, res) =>{
    res.status(404)
    if (req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
        } else if (req.accepts('json')){
            res.json({ error: '404 Not found' })
            } else {
                res.type('txt').send('404 Not found')
                }
    })

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})




/* //Chaining route handlers
const one = (req, res, next) => {
    console.log('one')
    next()
}
const two = (req, res, next) => {
    console.log('two')
    next()
}
const three = (req, res, next) => {
    console.log('three')
    res.send('Final')
    next()
}

//app.use is for middleware and does accept regex (/*) while app.all is more for oruting and applies to all http 

app.get('/chain(.html)?',[one, two, three] ) */


