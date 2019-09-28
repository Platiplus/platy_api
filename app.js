// DEPENDENCIES
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const app = express()

// MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// DB CONNECTION
mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_SRV}${process.env.DB_OPTIONS}`,
  {
    useNewUrlParser: true
  }
)

// ERROR 404 HANDLING
app.use((request, response, next) => {
  const error = new Error('Route not found')
  error.status = 404
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
