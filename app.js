// DEPENDENCIES
const bodyParser = require('body-parser')
const Database = require('./utils/Database')
const { errors } = require('celebrate')
const express = require('express')
const cors = require('cors')
const app = express()

// CONTROLLERS
const userRoutes = require('./api/routes/user-routes')
const transactionRoutes = require('./api/routes/transaction-routes')

// MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.disable('x-powered-by')

// DB CONNECTION
const db = new Database()
db.connect(process.env.DB_TEST_DATABASE)

// ROUTES
app.use('/users', userRoutes)
app.use('/transactions', transactionRoutes)

// CELEBRATE ERROR HANDLING
app.use(errors())

// ERROR 404 HANDLING
app.use((request, response, next) => {
  return response.status(404).json({ error: true, message: 'Route not found' })
})

// APP EXPORTING
module.exports = app
