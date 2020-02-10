const { celebrate } = require('celebrate')
const express = require('express')
const router = express.Router()
const controller = require('../controllers/transaction-controller')
const model = require('../models/validation-model')
const setOwner = require('../middlewares/set_owner.dev')

router.post('/', celebrate(model.transactionCreateModel), setOwner, controller.create)
router.get('/all', celebrate(model.transactionReadAllModel), setOwner, controller.readAll)
router.get('/:id', celebrate(model.transactionReadOneModel), controller.readOne)
router.patch('/:id', celebrate(model.transactionUpdateModel), controller.update)
router.delete('/:id', celebrate(model.transactionDeleteModel), controller.remove)

module.exports = router
