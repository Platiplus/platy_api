const { celebrate } = require('celebrate')
const express = require('express')
const router = express.Router()
const controller = require('../controllers/transaction-controller')
const model = require('../models/validation-model')
const setOwner = require('../middlewares/set_owner.dev')
const verify = require('../middlewares/verify_token.dev')

router.post('/', celebrate(model.transactionCreateModel), verify, setOwner, controller.create)
router.get('/all', celebrate(model.transactionReadAllModel), verify, setOwner, controller.readAll)
router.get('/:id', celebrate(model.transactionReadOneModel), verify, controller.readOne)
router.patch('/:id', celebrate(model.transactionUpdateModel), verify, controller.update)
router.delete('/:id', celebrate(model.transactionDeleteModel), verify, controller.remove)

router.post('/many/', celebrate(model.transactionCreateModel), verify, setOwner, controller.createMany)
router.patch('/many/:id', celebrate(model.transactionUpdateManyModel), verify, setOwner, controller.updateMany)
router.delete('/many/:id', celebrate(model.transactionDeleteManyModel), verify, setOwner, controller.deleteMany)

module.exports = router
