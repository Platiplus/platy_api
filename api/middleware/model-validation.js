const Joi = require('joi')

const validation = (model) => {
  return (req, res, next) => {
    const { error } = Joi.validate(req.body, model)
    const valid = error == null

    if (valid) {
      next()
    } else {
      const { details } = error
      const message = details.map(i => i.message).join(',')

      res.status(422).json({ error: message })
    }
  }
}
module.exports = validation
