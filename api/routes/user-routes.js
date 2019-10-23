const express = require('express')
const router = express.Router()
const controller = require('../controllers/user-controller')
const validate = require('../middleware/model-validation')
const model = require('../models/validation-model')

router.post('/create', validate(model.userCreationModel), controller.create)

module.exports = router
