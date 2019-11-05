// DEPENDENCIES
const bodyParser = require('body-parser')
const Database = require('./utils/Database')
const { errors } = require('celebrate')
const express = require('express')
const cors = require('cors')
const app = express()

// CONTROLLERS
const userRoutes = require('./api/routes/user-routes')

// MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// DB CONNECTION
const db = new Database()
db.connect('development')

// ROUTES
app.use('/users', userRoutes)

// ERROR HANDLING
app.use(errors())

// ERROR 404 HANDLING
app.use((request, response, next) => {
  const error = {
    message: 'Route Not Found',
    status: 404
  }
  next(error)
})
// GENERIC ERROR HANDLING
app.use((error, request, response, next) => {
  response.status(error.status || 500)
  response.json({
    error: {
      message: error.message
    }
  })
})

// APP EXPORTING
module.exports = app
