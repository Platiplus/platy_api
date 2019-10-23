const Joi = require('joi')
const schemas = {
  userCreationModel: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().required(),
    initialBalance: Joi.number().required()
  })
}
module.exports = schemas
