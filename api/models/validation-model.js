const { Joi } = require('celebrate')

const schemas = {
  userCreateModel: {
    body: Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().email().required(),
      initialBalance: Joi.number().required()
    })
  },
  userReadModel: {
    params: Joi.object().keys({
      id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
    })
  },
  userUpdateModel: {
    params: Joi.object().keys({
      id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
  },
  userDeleteModel: {
    params: Joi.object().keys({
      id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
  }
}

module.exports = schemas
