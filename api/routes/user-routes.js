const { celebrate } = require('celebrate')
const express = require('express')
const router = express.Router()
const controller = require('../controllers/user-controller')
const model = require('../models/validation-model')

router.post('/create', celebrate(model.userCreationModel), controller.create)
router.get('/find/:id?', celebrate(model.userFindModel), controller.find)

module.exports = router
