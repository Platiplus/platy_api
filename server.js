// DEPENDENCIES
require('dotenv').config()
const http = require('http')
const app = require('./app')

// PORT SELECTION
const port = process.env.PORT || 8080

// SERVER CREATION
const server = http.createServer(app)
server.listen(port, () => {
  console.log('Server is listening on port: ' + port)
})
