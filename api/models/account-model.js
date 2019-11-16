// DEPENDENCIES
const mongoose = require('mongoose')

// DECLARATION OF USER MODEL
const accountSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    description: {
      type: String, required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId, required: true
    },
    balance: {
      type: Number, required: true
    }
  }
)

// EXPORTING OF MODEL
module.exports = mongoose.model('Account', accountSchema, 'accounts')
