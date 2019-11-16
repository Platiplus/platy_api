// DEPENDENCIES
const winston = require('../../config/winston-logger')
const mongoose = require('mongoose')

// MODEL IMPORTING
const Account = require('../models/account-model')

// CREATE A NEW ACCOUNT
const create = async (request, response) => {
  try {
    const { description, balance } = request.body

    // @TODO Owner id should come from jwt token
    const owner = request.params.userId

    const account = new Account({
      _id: mongoose.Types.ObjectId(),
      description,
      balance,
      owner: mongoose.Types.ObjectId(owner)
    })

    const createdAccount = await account.save()

    const data = {
      message: 'Account created succesfully!',
      createdAccount: {
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
      }
    }
    response.status(201).json(data)
  } catch (error) {
    winston.log('error', `${new Date()} ${error}`)
  }
}

// READ AN ACCOUNT
const readOne = async (request, response) => {
  try {
    const dbAccount = await Account.findById(mongoose.Types.ObjectId(request.params.id))

    if (!dbAccount) {
      return response.status(404).json({ error: true, message: 'Account not found on database' })
    }

    const data = {
      account: {
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
      }
    }
    response.status(200).json(data)
  } catch (error) {
    winston.log('error', `${new Date()} ${error}`)
  }
}

// READ ALL ACCOUNTS OF A SPECIFIC USER
const readAll = async (request, response) => {
  try {
    // @TODO Owner id should come from jwt token
    const dbAccount = await Account.find({ owner: request.params.userId })

    const data = {
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
  } catch (error) {
    winston.log('error', `${new Date()} ${error}`)
  }
}

// DELETE AN ACCOUNT
const remove = async (request, response) => {
  try {
    const dbAccount = await Account.findByIdAndDelete(mongoose.Types.ObjectId(request.params.id))

    if (!dbAccount) {
      return response.status(404).json({ error: true, message: 'Account not found on database' })
    }

    const data = {
      message: 'Account deleted successfully',
      requests: [
        {
          type: 'POST',
          url: `${process.env.API_URL}/accounts/`,
          data: { description: 'String', balance: 'Number', owner: 'String' }
        }
      ]
    }
    response.status(200).json(data)
  } catch (error) {
    winston.log('error', `${new Date()} ${error}`)
  }
}

// UPDATE DATA ON AN ACCOUNT
const update = async (request, response) => {
  try {
    const id = mongoose.Types.ObjectId(request.params.id)

    const dbAccount = await Account.findByIdAndUpdate(id, request.body)

    if (!dbAccount) {
      return response.status(404).json({ error: true, message: 'Account not found on database' })
    }

    const data = {
      account: {
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
      }
    }

    response.status(200).json(data)
  } catch (error) {
    winston.log('error', `${new Date()} ${error}`)
  }
}

module.exports = {
  create,
  readOne,
  readAll,
  update,
  remove
}
