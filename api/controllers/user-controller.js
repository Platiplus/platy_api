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
    response.status(500).json({ message: 'User was not created', error: error.message })
  }
}

module.exports = {
  create
}
