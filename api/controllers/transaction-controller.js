// DEPENDENCIES
const mongoose = require('mongoose')
const Utils = require('../../utils/Utils')
const utils = new Utils()

// MODEL IMPORTING
const Transaction = require('../models/transaction-model')

// CREATE A NEW TRANSACTION
const create = async (request, response) => {
  const { type, date, description, target, value, category, status, quotas, account } = request.body
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
    owner: mongoose.Types.ObjectId(owner),
    account: mongoose.Types.ObjectId(account)
  })

  const createdTransaction = await transaction.save()

  const data = {
    message: 'Transaction created succesfully!',
    count: 1,
    transactions: [{
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
      account: createdTransaction.account,
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
    }]
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
    message: 'OK',
    count: 1,
    transactions: [{
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
      account: dbTransaction.account,
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
    }]
  }

  response.status(200).json(data)
}
// READ ALL TRANSACTIONS OF A SPECIFIC USER
const readAll = async (request, response) => {
  const dbTransaction = await Transaction.find(utils.createTransactionQuery(request.query, request.owner))

  const data = {
    message: 'OK',
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
        account: transaction.account,
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
// UPDATE DATA ON A TRANSACTION
const update = async (request, response) => {
  const id = mongoose.Types.ObjectId(request.params.id)

  const parsedDate = utils.normalizeDate(request.body.date)

  if (request.body.date !== undefined && parsedDate === undefined) {
    return response.status(400).json({ error: true, message: 'Invalid date provided' })
  }

  if (parsedDate !== undefined) {
    request.body.date = parsedDate
  }

  const dbTransaction = await Transaction.findByIdAndUpdate(id, request.body)

  if (!dbTransaction) {
    return response.status(404).json({ error: true, message: 'Transaction not found on database' })
  }

  const data = {
    message: 'Transaction updated successfully',
    count: 1,
    transactions: [{
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
      account: dbTransaction.account,
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
    }]
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
    count: 1,
    transactions: [],
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
// CREATE MANY TRANSACTIONS
const createMany = async (request, response) => {
  const { type, date, description, target, value, category, status, quotas, account } = request.body
  const owner = request.owner

  const parsedDate = utils.normalizeDate(date)
  const parsedQuotas = parseInt(quotas)

  if (parsedDate === undefined) {
    return response.status(400).json({ error: 'Invalid date provided', message: 'Transaction was not created' })
  }

  if (isNaN(parsedQuotas)) {
    return response.status(400).json({ error: 'Invalid number of quotas provided', message: 'Transaction was not created' })
  }

  const transactionsToCreate = []
  const correlationId = mongoose.Types.ObjectId()

  for (let i = 0; i < parsedQuotas; i++) {
    transactionsToCreate.push(
      new Transaction({
        _id: mongoose.Types.ObjectId(),
        type,
        date: utils.normalizeDateOffset(date, i),
        description,
        target,
        value,
        category,
        status,
        quotas: correlationId,
        owner: mongoose.Types.ObjectId(owner),
        account: mongoose.Types.ObjectId(account)
      })
    )
  }

  const createdTransactions = await Transaction.create(transactionsToCreate)

  const data = {
    message: 'Transactions created successfully',
    count: createdTransactions.length,
    transactions: createdTransactions.map((transaction) => {
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
        account: transaction.account,
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

  response.status(201).json(data)
}
// UPDATE MANY TRANSACTIONS
const updateMany = async (request, response) => {
  const body = request.body
  const transactionsToUpdate = []

  const dbTransactions = await Transaction.find({ quotas: body.quotas, owner: request.owner }).sort({ date: 1 })
  const idx = dbTransactions.indexOf(dbTransactions.find((x) => x._id.toString() === request.params.id))

  if (dbTransactions.length === 0 || idx === -1) {
    return response.status(404).json({ error: true, message: 'Transactions not found on database' })
  }

  for (let i = idx; i < dbTransactions.length; i++) {
    transactionsToUpdate.push(dbTransactions[i]._id)
  }

  await Transaction.updateMany({ _id: { $in: transactionsToUpdate } }, body)

  const data = {
    message: 'Transactions updated successfully',
    count: transactionsToUpdate.length,
    transactions: dbTransactions.map((transaction) => {
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
        account: transaction.account,
        requests: [
          {
            type: 'GET',
            url: `${process.env.API_URL}/transactions/${transaction._id}`
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
// DELETE MANY TRANSACTIONS
const deleteMany = async (request, response) => {
  const body = request.body
  const transactionsToDelete = []

  const dbTransactions = await Transaction.find({ quotas: body.quotas, owner: request.owner }).sort({ date: 1 })
  const idx = dbTransactions.indexOf(dbTransactions.find((x) => x._id.toString() === request.params.id))

  if (dbTransactions.length === 0 || idx === -1) {
    return response.status(404).json({ error: true, message: 'Transactions not found on database' })
  }

  for (let i = idx; i < dbTransactions.length; i++) {
    transactionsToDelete.push(dbTransactions[i]._id)
  }

  await Transaction.deleteMany({ _id: { $in: transactionsToDelete } })

  const data = {
    message: 'Transactions deleted successfully',
    count: transactionsToDelete.length,
    transactions: [],
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

module.exports = {
  create,
  readOne,
  readAll,
  update,
  remove,
  createMany,
  updateMany,
  deleteMany
}
