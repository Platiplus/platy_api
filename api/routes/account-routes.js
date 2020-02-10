const { celebrate } = require('celebrate')
const express = require('express')
const router = express.Router()
const controller = require('../controllers/account-controller')
const model = require('../models/validation-model')
const setOwner = require('../middlewares/set_owner.dev')

router.post('/', celebrate(model.accountCreateModel), setOwner, controller.create)
router.get('/all', setOwner, controller.readAll)
router.get('/:id', celebrate(model.accountReadOneModel), controller.readOne)
router.patch('/:id', celebrate(model.accountUpdateModel), controller.update)
router.delete('/:id', celebrate(model.accountDeleteModel), controller.remove)

module.exports = router
