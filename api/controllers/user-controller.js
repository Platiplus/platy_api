// DEPENDENCIES
const mongoose = require('mongoose')

// MODEL IMPORTING
const User = require('../models/user-model')

// AUTHENTICATION REQUIREMENTS
const bcrypt = require('bcrypt-nodejs')

// CREATE A NEW USER ON THE DATABASE
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

      response.status(201).json({ message: 'User Created succesfully!', data: createdUser })
    } else {
      response.status(409).json({ error: true, message: 'User Already Exists' })
    }
  } catch (error) {
    response.status(500).json({ message: 'User was not created', error })
  }
}

const read = async (request, response) => {
  try {
    const dbUser = request.params.id === undefined
      ? await User.find({})
      : await User.findById(mongoose.Types.ObjectId(request.params.id))

    if (!dbUser) {
      return response.status(404).json({ error: true, message: 'User not found on database' })
    }

    response.status(200).json({ error: false, data: dbUser })
  } catch (error) {
    response.status(500).json({ error })
  }
}

const remove = async (request, response) => {
  try {
    const dbUser = await User.findByIdAndDelete(mongoose.Types.ObjectId(request.params.id))

    if (!dbUser) {
      return response.status(404).json({ error: true, message: 'User not found on database' })
    }

    response.status(204).send()
  } catch (error) {
    response.status(500).json({ error: true, message: error.message })
  }
}

const update = async (request, response) => {
  try {
    const id = mongoose.Types.ObjectId(request.params.id)

    const dbUser = await User.findByIdAndUpdate(id, request.body)

    if (!dbUser) {
      return response.status(404).json({ error: true, message: 'User not found on database' })
    }

    response.status(200).json({ error: false, data: dbUser })
  } catch (error) {
    response.status(500).json({ error: true, message: error.message })
  }
}

module.exports = {
  create,
  read,
  update,
  remove
}
