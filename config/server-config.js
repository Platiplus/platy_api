module.exports = {
  development: {
    port: process.env.DEV_SERVER_PORT
  },
  test: {
    port: process.env.TEST_SERVER_PORT
  },
  production: {
    port: process.env.PRODUCTION_SERVER_PORT
  }
}
