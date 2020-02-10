// DEPENDENCIES
const mongoose = require('mongoose')
const Utils = require('../../utils/Utils')
const utils = new Utils()

// MODEL IMPORTING
const Transaction = require('../models/transaction-model')

// CREATE A NEW TRANSACTION
const create = async (request, response) => {
    const { type, date, description, target, value, category, status, quotas } = request.body
    const owner = request.owner

    const parsedDate = utils.normalizeDate(date)

    if (parsedDate === undefined) {
      return response.status(400).json({ error: 'Invalid date provided', message: 'Transaction was not created' })
    }

    const transaction = new Transaction({
      _id: mongoose.Types.ObjectId(),
      type,
      date: parsedDate,
      description,
      target,
      value,
      category,
      status,
      quotas,
      owner: mongoose.Types.ObjectId(owner)
    })

    const createdTransaction = await transaction.save()

    const data = {
      message: 'Transaction created succesfully!',
      createdTransaction: {
        _id: createdTransaction._id,
        type: createdTransaction.type,
        date: createdTransaction.date,
        description: createdTransaction.description,
        target: createdTransaction.target,
        value: createdTransaction.value,
        category: createdTransaction.category,
        status: createdTransaction.status,
        quotas: createdTransaction.quotas,
        owner: createdTransaction.owner,
        requests: [
          {
            type: 'GET',
            url: `${process.env.API_URL}/transactions/${createdTransaction._id}`
          },
          {
            type: 'PATCH',
            url: `${process.env.API_URL}/transactions/${createdTransaction._id}`,
            data: { type: 'Number?', date: 'String?', description: 'String?', target: 'String?', value: 'Number?', category: 'String?', status: 'Boolean?', owner: 'String' }
          },
          {
            type: 'DELETE',
            url: `${process.env.API_URL}/transactions/${createdTransaction._id}`
          }
        ]
      }
    }
    response.status(201).json(data)
}
// READ A TRANSACTION
const readOne = async (request, response) => {
    const dbTransaction = await Transaction.findById(mongoose.Types.ObjectId(request.params.id))

    if (!dbTransaction) {
      return response.status(404).json({ error: true, message: 'Transaction not found on database' })
    }

    const data = {
      transaction: {
        _id: dbTransaction._id,
        type: dbTransaction.type,
        date: dbTransaction.date,
        description: dbTransaction.description,
        target: dbTransaction.target,
        value: dbTransaction.value,
        category: dbTransaction.category,
        status: dbTransaction.status,
        quotas: dbTransaction.quotas,
        owner: dbTransaction.owner,
        requests: [
          {
            type: 'PATCH',
            url: `${process.env.API_URL}/transactions/${dbTransaction._id}`,
            data: { type: 'Number?', date: 'String?', description: 'String?', target: 'String?', value: 'Number?', category: 'String?', status: 'Boolean?', owner: 'String' }
          },
          {
            type: 'DELETE',
            url: `${process.env.API_URL}/transactions/${dbTransaction._id}`
          }
        ]
      }
    }

    response.status(200).json(data)
}
// READ ALL TRANSACTIONS OF A SPECIFIC USER
const readAll = async (request, response) => {
    const dbTransaction = await Transaction.find(utils.createTransactionQuery(request.params, request.owner))

    const data = {
      count: dbTransaction.length,
      transactions: dbTransaction.map((transaction) => {
        return {
          _id: transaction._id,
          type: transaction.type,
          date: transaction.date,
          description: transaction.description,
          target: transaction.target,
          value: transaction.value,
          category: transaction.category,
          status: transaction.status,
          quotas: transaction.quotas,
          owner: transaction.owner,
          requests: [
            {
              type: 'GET',
              url: `${process.env.API_URL}/transactions/${transaction._id}`
            },
            {
              type: 'PATCH',
              url: `${process.env.API_URL}/transactions/${transaction._id}`,
              data: { type: 'Number?', date: 'String?', description: 'String?', target: 'String?', value: 'Number?', category: 'String?', status: 'Boolean?', owner: 'String' }
            },
            {
              type: 'DELETE',
              url: `${process.env.API_URL}/transactions/${transaction._id}`
            }
          ]
        }
      })
    }
    response.status(200).json(data)
}
// DELETE A TRANSACTION
const remove = async (request, response) => {
    const dbTransaction = await Transaction.findByIdAndDelete(mongoose.Types.ObjectId(request.params.id))

    if (!dbTransaction) {
      return response.status(404).json({ error: true, message: 'Transaction not found on database' })
    }

    const data = {
      message: 'Transaction deleted successfully',
      requests: [
        {
          type: 'POST',
          url: `${process.env.API_URL}/transactions/`,
          data: { type: 'Number', date: 'String', description: 'String', target: 'String', value: 'Number', category: 'String', status: 'Boolean', quotas: 'String', owner: 'String' }
        }
      ]
    }
    response.status(200).json(data)
}
// UPDATE DATA ON A TRANSACTION
const update = async (request, response) => {
    const id = mongoose.Types.ObjectId(request.params.id)

    const parsedDate = utils.normalizeDate(request.body.date)

    if (request.body.date !== undefined && parsedDate === undefined) {
      return response.status(400).json({ error: true, message: 'Invalid date provided' })
    }

    request.body.date = parsedDate

    const dbTransaction = await Transaction.findByIdAndUpdate(id, request.body)

    if (!dbTransaction) {
      return response.status(404).json({ error: true, message: 'Transaction not found on database' })
    }

    const data = {
      transaction: {
        _id: dbTransaction._id,
        type: dbTransaction.type,
        date: dbTransaction.date,
        description: dbTransaction.description,
        target: dbTransaction.target,
        value: dbTransaction.value,
        category: dbTransaction.category,
        status: dbTransaction.status,
        quotas: dbTransaction.quotas,
        owner: dbTransaction.owner,
        requests: [
          {
            type: 'GET',
            url: `${process.env.API_URL}/transactions/${dbTransaction._id}`
          },
          {
            type: 'DELETE',
            url: `${process.env.API_URL}/transactions/${dbTransaction._id}`
          }
        ]
      }
    }
    response.status(200).json(data)
}

module.exports = {
  create,
  readOne,
  readAll,
  update,
  remove
}
