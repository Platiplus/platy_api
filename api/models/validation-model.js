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
  userReadOneModel: {
    params: Joi.object().keys({
      id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
  },
  userUpdateModel: {
    params: Joi.object().keys({
      id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),
    body: Joi.object().min(1).keys({
      username: Joi.string(),
      password: Joi.string(),
      email: Joi.string().email(),
      initialBalance: Joi.number()
    })
  },
  userDeleteModel: {
    params: Joi.object().keys({
      id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
  },
  transactionCreateModel: {
    params: Joi.object().keys({
      userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),
    body: Joi.object().keys({
      type: Joi.number().min(0).max(2),
      date: Joi.string().regex(/^\d{2}([./-])\d{2}\1\d{4}$/).required(),
      description: Joi.string().required(),
      target: Joi.string().required(),
      value: Joi.number().required(),
      category: Joi.string().required(),
      status: Joi.boolean().required()
    })
  },
  transactionReadOneModel: {
    params: Joi.object().keys({
      id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
  },
  transactionUpdateModel: {
    params: Joi.object().keys({
      id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),
    body: Joi.object().min(1).keys({
      type: Joi.number().min(0).max(2),
      date: Joi.string().regex(/^\d{2}([./-])\d{2}\1\d{4}$/),
      description: Joi.string(),
      target: Joi.string(),
      value: Joi.number(),
      category: Joi.string(),
      status: Joi.boolean()
    })
  },
  transactionDeleteModel: {
    params: Joi.object().keys({
      id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
  }
}

module.exports = schemas
