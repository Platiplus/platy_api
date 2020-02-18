const { celebrate } = require('celebrate')
const express = require('express')
const router = express.Router()
const controller = require('../controllers/account-controller')
const model = require('../models/validation-model')
const setOwner = require('../middlewares/set_owner.dev')
const verify = require('../middlewares/verify_token.dev')

router.post('/', celebrate(model.accountCreateModel), verify, setOwner, controller.create)
router.get('/all', verify, setOwner, controller.readAll)
router.get('/:id', celebrate(model.accountReadOneModel), verify, controller.readOne)
router.patch('/:id', celebrate(model.accountUpdateModel), verify, controller.update)
router.delete('/:id', celebrate(model.accountDeleteModel), verify, controller.remove)

module.exports = router
