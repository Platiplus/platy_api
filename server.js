// DEPENDENCIES
require('dotenv').config()

const http = require('http')
const app = require('./app')

const environment = require('./config/server-config').development

// PORT SELECTION
const port = environment.port

// SERVER CREATION
const server = http.createServer(app)
server.listen(port, () => {
  console.log('Server is listening on port: ' + port)
})
