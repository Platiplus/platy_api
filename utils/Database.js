// DEPENDENCIES
const mongoose = require('mongoose')

// DATABASE CONNECTION FACTORY
class Database {
  connect (environment = 'development') {
    const { username, password, server, database, options } = require('../config/db-config')[environment]

    return mongoose.connect(
      `mongodb+srv://${username}:${password}@${server}/${database}?${options}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      }
    )
  }
}

module.exports = Database
