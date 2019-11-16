const { celebrate } = require('celebrate')
const express = require('express')
const router = express.Router()
const controller = require('../controllers/transaction-controller')
const model = require('../models/validation-model')

// @TODO fix routing normalization when userId is passed through jwt
router.post('/:userId', celebrate(model.transactionCreateModel), controller.create)
router.get('/user/:userId', celebrate(model.transactionReadAllModel), controller.readAll)
router.get('/:id', celebrate(model.transactionReadOneModel), controller.readOne)
router.patch('/:id', celebrate(model.transactionUpdateModel), controller.update)
router.delete('/:id', celebrate(model.transactionDeleteModel), controller.remove)

module.exports = router
