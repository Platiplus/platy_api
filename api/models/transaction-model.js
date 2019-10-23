// DEPENDENCIES
const mongoose = require('mongoose')

// DECLARATION OF USER MODEL
const transactionSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    type: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    target: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    status: {
      type: Boolean,
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  }
)

// EXPORTING OF MODEL
module.exports = mongoose.model('Transaction', transactionSchema, 'transactions')
