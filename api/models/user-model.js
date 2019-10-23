// DEPENDENCIES
const mongoose = require('mongoose')

// DECLARATION OF USER MODEL
const userSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: {
      type: String, required: true
    },
    password: {
      type: String, required: true
    },
    email: {
      type: String, required: true
    },
    initialBalance: {
      type: Number, required: true
    }
  }
)

// EXPORTING OF MODEL
module.exports = mongoose.model('User', userSchema, 'users')
