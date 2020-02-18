const { celebrate } = require('celebrate')
const express = require('express')
const router = express.Router()
const controller = require('../controllers/user-controller')
const model = require('../models/validation-model')
const verify = require('../middlewares/verify_token.dev')
const setOwner = require('../middlewares/set_owner.dev')

router.post('/', celebrate(model.userCreateModel), controller.create)
router.get('/all', verify, setOwner, controller.readAll)
router.get('/', verify, setOwner, controller.readOne)
router.patch('/', celebrate(model.userUpdateModel), verify, setOwner, controller.update)
router.delete('/', verify, setOwner, controller.remove)

module.exports = router
