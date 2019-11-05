// DEPENDENCIES
const mongoose = require('mongoose')

// DATABASE CONNECTION FACTORY
class Database {
  connect (environment) {
    const { username, password, server, database, options } = require('../config/db-config')[environment]

    mongoose.connect(
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
