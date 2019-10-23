// DEPENDENCIES
const mongoose = require('mongoose')
const path = require('path')

// DATABASE CONNECTION FACTORY
class Database {
  connect (environment) {
    const { username, password, server, database, options } = require(path.join(__dirname, '..', 'config', 'db-config.json'))[environment]

    mongoose.connect(
      `mongodb+srv://${username}:${password}@${server}/${database}?${options}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    )
  }
}

module.exports = Database
