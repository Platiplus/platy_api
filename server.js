// DEPENDENCIES
const http = require('http')
const app = require('./app')
const path = require('path')

const environment = require(path.join(__dirname, 'config', 'server-config.json')).development

// PORT SELECTION
const port = environment.port

// SERVER CREATION
const server = http.createServer(app)
server.listen(port, () => {
  console.log('Server is listening on port: ' + port)
})
