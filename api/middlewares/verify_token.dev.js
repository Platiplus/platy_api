const axios = require('axios')

module.exports = async (request, response, next) => {
  try {
    await axios.post(`${process.env.AUTH_URL}/verify`,
    {}, { headers: { authorization: request.headers.authorization } })
    next()
  }
  catch (error) {
    return response.status(401).json({ error: true, message: 'Unauthorized' })
  }
}