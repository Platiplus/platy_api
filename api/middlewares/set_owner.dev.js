const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
  const t = request.headers.authorization.split(' ')
  request.owner = jwt.decode(t[1]).userId
  next()
}
