const { celebrate } = require('celebrate')
const express = require('express')
const router = express.Router()
const controller = require('../controllers/user-controller')
const model = require('../models/validation-model')

router.post('/', celebrate(model.userCreateModel), controller.create)
router.get('/:id?', celebrate(model.userReadModel), controller.read)
router.patch('/:id', celebrate(model.userUpdateModel), controller.update)
router.delete('/:id', celebrate(model.userDeleteModel), controller.remove)

module.exports = router
