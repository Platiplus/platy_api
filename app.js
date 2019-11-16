// DEPENDENCIES
const bodyParser = require('body-parser')
const Database = require('./utils/Database')
const { errors } = require('celebrate')
const express = require('express')
const helmet = require('helmet')
const fileSystem = require('fs')
const logger = require('morgan')
const path = require('path')
const cors = require('cors')
const app = express()

const accessLogStream = fileSystem.createWriteStream(path.join(__dirname, '/logs/access.log'), { flags: 'a' })

// CONTROLLERS
const userRoutes = require('./api/routes/user-routes')
const transactionRoutes = require('./api/routes/transaction-routes')
const accountRoutes = require('./api/routes/account-routes')

// MIDDLEWARES
app.use(helmet())
app.use(logger('combined', { stream: accessLogStream }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// DB CONNECTION
const db = new Database()
db.connect(process.env.DB_TEST_DATABASE)

// ROUTES
app.use('/users', userRoutes)
app.use('/transactions', transactionRoutes)
app.use('/accounts', accountRoutes)

// CELEBRATE ERROR HANDLING
app.use(errors())

// ERROR 404 HANDLING
app.use((request, response, next) => {
  return response.status(404).json({ error: true, message: 'Route not found' })
})

// APP EXPORTING
module.exports = app
