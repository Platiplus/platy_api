// DEPENDENCIES
const mongoose = require('mongoose')

// MODEL IMPORTING
const User = require('../models/user-model')

// AUTHENTICATION REQUIREMENTS
const bcrypt = require('bcrypt-nodejs')

// CREATE A NEW USER
const create = async (request, response) => {
  try {
    const dbUser = await User.findOne({ email: request.body.email.toLowerCase() })

    if (!dbUser) {
      const { username, password, email, initialBalance } = request.body

      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(password, salt)
      const user = new User({
        _id: mongoose.Types.ObjectId(),
        username: username.toLowerCase(),
        password: hash,
        email: email.toLowerCase(),
        initialBalance: initialBalance
      })

      const createdUser = await user.save()

      const data = {
        message: 'User created succesfully!',
        createdUser: {
          _id: createdUser._id,
          username: createdUser.username,
          email: createdUser.email,
          initialBalance: createdUser.initialBalance,
          requests: [
            {
              type: 'GET',
              url: `${process.env.API_URL}/users/${createdUser._id}`
            },
            {
              type: 'PATCH',
              url: `${process.env.API_URL}/users/${createdUser._id}`,
              data: { email: 'String?', username: 'String?', initialBalance: 'Number?', password: 'String?' }
            },
            {
              type: 'DELETE',
              url: `${process.env.API_URL}/users/${createdUser._id}`
            }
          ]
        }
      }
      response.status(201).json(data)
    } else {
      response.status(409).json({ error: true, message: 'User Already Exists' })
    }
  } catch (error) {
    console.log('error', `${new Date()} ${error}`)
  }
}
// READ A SPECIFIC USER
const readOne = async (request, response) => {
  try {
    const dbUser = await User.findById(mongoose.Types.ObjectId(request.params.id))

    if (!dbUser) {
      return response.status(404).json({ error: true, message: 'User not found on database' })
    }

    const data = {
      user: {
        _id: dbUser._id,
        username: dbUser.username,
        email: dbUser.email,
        initialBalance: dbUser.initialBalance,
        requests: [
          {
            type: 'PATCH',
            url: `${process.env.API_URL}/users/${dbUser._id}`,
            data: { email: 'String?', username: 'String?', initialBalance: 'Number?', password: 'String?' }
          },
          {
            type: 'DELETE',
            url: `${process.env.API_URL}/users/${dbUser._id}`
          }
        ]
      }
    }

    response.status(200).json(data)
  } catch (error) {
    console.log('error', `${new Date()} ${error}`)
  }
}
// READ ALL USERS
const readAll = async (request, response) => {
  try {
    const dbUser = await User.find({})

    const data = {
      count: dbUser.length,
      users: dbUser.map((user) => {
        return {
          _id: user._id,
          username: user.username,
          email: user.email,
          initialBalance: user.initialBalance,
          requests: [
            {
              type: 'GET',
              url: `${process.env.API_URL}/users/${user._id}`
            },
            {
              type: 'PATCH',
              url: `${process.env.API_URL}/users/${user._id}`,
              data: { email: 'String?', username: 'String?', initialBalance: 'Number?', password: 'String?' }
            },
            {
              type: 'DELETE',
              url: `${process.env.API_URL}/users/${user._id}`
            }
          ]
        }
      })
    }

    response.status(200).json(data)
  } catch (error) {
    response.status(500).json({ error: true, message: error.message })
  }
}
// DELETE AN USER
const remove = async (request, response) => {
  try {
    const dbUser = await User.findByIdAndDelete(mongoose.Types.ObjectId(request.params.id))

    if (!dbUser) {
      return response.status(404).json({ error: true, message: 'User not found on database' })
    }

    const data = {
      message: 'User deleted successfully',
      requests: [
        {
          type: 'POST',
          url: `${process.env.API_URL}/users/`,
          data: { email: 'String', username: 'String', initialBalance: 'Number', password: 'String' }
        }
      ]
    }
    response.status(200).json(data)
  } catch (error) {
    console.log('error', `${new Date()} ${error}`)
  }
}
// UPDATE AN USER
const update = async (request, response) => {
  try {
    const id = mongoose.Types.ObjectId(request.params.id)

    const dbUser = await User.findByIdAndUpdate(id, request.body)

    if (!dbUser) {
      return response.status(404).json({ error: true, message: 'User not found on database' })
    }

    const data = {
      user: {
        _id: dbUser._id,
        username: dbUser.username,
        email: dbUser.email,
        initialBalance: dbUser.initialBalance,
        requests: [
          {
            type: 'GET',
            url: `${process.env.API_URL}/users/${dbUser._id}`
          },
          {
            type: 'DELETE',
            url: `${process.env.API_URL}/users/${dbUser._id}`
          }
        ]
      }
    }

    response.status(200).json(data)
  } catch (error) {
    console.log('error', `${new Date()} ${error}`)
  }
}

module.exports = {
  create,
  readOne,
  readAll,
  update,
  remove
}
