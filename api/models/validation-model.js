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
  userUpdateModel: {
    body: Joi.object().min(1).keys({
      username: Joi.string(),
      password: Joi.string(),
      email: Joi.string().email(),
      initialBalance: Joi.number()
    })
  },
  transactionCreateModel: {
    body: Joi.object().keys({
      type: Joi.number().min(0).max(2).required(),
      date: Joi.string().regex(/^\d{2}([./-])\d{2}\1\d{4}$/).required(),
      description: Joi.string().required(),
      target: Joi.string().required(),
      value: Joi.number().required(),
      category: Joi.string().required(),
      status: Joi.boolean().required(),
      quotas: Joi.string().required(),
      account: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
  },
  transactionReadOneModel: {
    params: Joi.object().keys({
      id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
  },
  transactionReadAllModel: {
    params: Joi.object().keys({
      type: Joi.number().min(0).max(2),
      target: Joi.string(),
      category: Joi.string(),
      status: Joi.boolean(),
      quotas: Joi.string(),
      dateStart: Joi.string().regex(/^\d{2}([./-])\d{2}\1\d{4}$/),
      dateEnd: Joi.string().regex(/^\d{2}([./-])\d{2}\1\d{4}$/),
      account: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
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
      status: Joi.boolean(),
      quotas: Joi.string(),
      account: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
    })
  },
  transactionUpdateManyModel: {
    params: Joi.object().keys({
      id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),
    body: Joi.object().min(2).keys({
      type: Joi.number().min(0).max(2),
      description: Joi.string(),
      target: Joi.string(),
      value: Joi.number(),
      category: Joi.string(),
      status: Joi.boolean(),
      quotas: Joi.string().required(),
      account: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
    })
  },
  transactionDeleteModel: {
    params: Joi.object().keys({
      id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
  },
  transactionDeleteManyModel: {
    params: Joi.object().keys({
      id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),
    body: Joi.object().min(1).max(1).keys({
      quotas: Joi.string().required()
    })
  },
  accountCreateModel: {
    body: Joi.object().keys({
      description: Joi.string().required(),
      balance: Joi.number().required()
    })
  },
  accountReadOneModel: {
    params: Joi.object().keys({
      id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
  },
  accountUpdateModel: {
    params: Joi.object().keys({
      id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),
    body: Joi.object().min(1).keys({
      description: Joi.string(),
      balance: Joi.number()
    })
  },
  accountDeleteModel: {
    params: Joi.object().keys({
      id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
  }
}

module.exports = schemas
