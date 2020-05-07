// DEPENDENCIES
const mongoose = require('mongoose')

// MODEL IMPORTING
const Account = require('../models/account-model')

// CREATE A NEW ACCOUNT
const create = async (request, response) => {
  const { description, balance } = request.body
  const owner = request.owner

  const account = new Account({
    _id: mongoose.Types.ObjectId(),
    description,
    balance,
    owner: mongoose.Types.ObjectId(owner)
  })

  const createdAccount = await account.save()

  const data = {
    message: 'Account created succesfully!',
    count: 1,
    accounts: [{
      _id: createdAccount._id,
      description: createdAccount.description,
      balance: createdAccount.balance,
      owner: createdAccount.owner,
      requests: [
        {
          type: 'GET',
          url: `${process.env.API_URL}/accounts/${createdAccount._id}`
        },
        {
          type: 'PATCH',
          url: `${process.env.API_URL}/accounts/${createdAccount._id}`,
          data: { description: 'String?', balance: 'Number?' }
        },
        {
          type: 'DELETE',
          url: `${process.env.API_URL}/accounts/${createdAccount._id}`
        }
      ]
    }]
  }
  response.status(201).json(data)
}

// READ AN ACCOUNT
const readOne = async (request, response) => {
  const dbAccount = await Account.findById(mongoose.Types.ObjectId(request.params.id))

  if (!dbAccount) {
    return response.status(404).json({ error: true, message: 'Account not found on database' })
  }

  const data = {
    message: 'OK',
    count: 1,
    accounts: [{
      _id: dbAccount._id,
      description: dbAccount.description,
      balance: dbAccount.balance,
      owner: dbAccount.owner,
      requests: [
        {
          type: 'PATCH',
          url: `${process.env.API_URL}/accounts/${dbAccount._id}`,
          data: { description: 'String?', balance: 'Number?' }
        },
        {
          type: 'DELETE',
          url: `${process.env.API_URL}/accounts/${dbAccount._id}`
        }
      ]
    }]
  }
  response.status(200).json(data)
}

// READ ALL ACCOUNTS OF A SPECIFIC USER
const readAll = async (request, response) => {
  const dbAccount = await Account.find({ owner: request.owner })

  const data = {
    message: 'OK',
    count: dbAccount.length,
    accounts: dbAccount.map((account) => {
      return {
        _id: account._id,
        description: account.description,
        balance: account.balance,
        owner: account.owner,
        requests: [
          {
            type: 'GET',
            url: `${process.env.API_URL}/accounts/${account._id}`
          },
          {
            type: 'PATCH',
            url: `${process.env.API_URL}/accounts/${account._id}`,
            data: { description: 'String?', balance: 'Number?' }
          },
          {
            type: 'DELETE',
            url: `${process.env.API_URL}/accounts/${account._id}`
          }
        ]
      }
    })
  }

  response.status(200).json(data)
}

// DELETE AN ACCOUNT
const remove = async (request, response) => {
  const dbAccount = await Account.findByIdAndDelete(mongoose.Types.ObjectId(request.params.id))

  if (!dbAccount) {
    return response.status(404).json({ error: true, message: 'Account not found on database' })
  }

  const data = {
    message: 'Account deleted successfully',
    count: 1,
    accounts: [],
    requests: [
      {
        type: 'POST',
        url: `${process.env.API_URL}/accounts/`,
        data: { description: 'String', balance: 'Number', owner: 'String' }
      }
    ]
  }
  response.status(200).json(data)
}

// UPDATE DATA ON AN ACCOUNT
const update = async (request, response) => {
  const id = mongoose.Types.ObjectId(request.params.id)

  const dbAccount = await Account.findByIdAndUpdate(id, request.body)

  if (!dbAccount) {
    return response.status(404).json({ error: true, message: 'Account not found on database' })
  }

  const data = {
    message: 'Account updated successfully',
    count: 1,
    accounts: [{
      _id: dbAccount._id,
      description: dbAccount.description,
      balance: dbAccount.balance,
      owner: dbAccount.owner,
      requests: [
        {
          type: 'GET',
          url: `${process.env.API_URL}/accounts/${dbAccount._id}`
        },
        {
          type: 'DELETE',
          url: `${process.env.API_URL}/accounts/${dbAccount._id}`
        }
      ]
    }]
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
