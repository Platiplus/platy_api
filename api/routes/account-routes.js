const { celebrate } = require('celebrate')
const express = require('express')
const router = express.Router()
const controller = require('../controllers/account-controller')
const model = require('../models/validation-model')

// @TODO fix routing normalization when userId is passed through jwt
router.post('/:userId', celebrate(model.accountCreateModel), controller.create)
router.get('/user/:userId', celebrate(model.accountReadAllModel), controller.readAll)
router.get('/:id', celebrate(model.accountReadOneModel), controller.readOne)
router.patch('/:id', celebrate(model.accountUpdateModel), controller.update)
router.delete('/:id', celebrate(model.accountDeleteModel), controller.remove)

module.exports = router
