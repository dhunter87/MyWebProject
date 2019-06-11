var express = require('express')
var expressHandlebars = require('express-handlebars')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var mustacheExpress = require('mustache-express')
var morgan = require('morgan')
var routes = require('./routes')
const dotenv = require('dotenv').config()
var helmet = require('helmet')


// create a new express app:
var app = express()

// the port to listen on. choose whatever you want!
var port = process.env.PORT || 3000
app.set('trust proxy', 1)

// set up logging on our app:
app.use(morgan('dev'))

// set up helmet
app.use(helmet())

// turn JSON in requests to something we can work with:
app.use(bodyParser.json())

// let us set and retrieve cookies for user auth:
app.use(cookieParser(process.env.COOKIE_SECRET))

// turn forms in requests to something we can work with:
app.use(bodyParser.urlencoded({ extended: true }))

// serve everything in the public directory:
app.use(express.static('public'))

// use the mustache for rendering views:
app.engine('html', expressHandlebars())
app.set('view engine', 'handlebars')

// create all the routes
app.use(routes)

// start the app!
app.listen(process.env.PORT, function() {
  console.log('Server listening on ' + process.env.BASE_URL + process.env.PORT)
})
