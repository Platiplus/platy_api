module.exports = {
  development: {
    username: process.env.DB_DEV_USERNAME,
    password: process.env.DB_DEV_PASSWORD,
    server: process.env.DB_DEV_SERVER,
    database: process.env.DB_DEV_DATABASE,
    options: process.env.DB_DEV_OPTIONS
  },
  test: {
    username: process.env.DB_TEST_USERNAME,
    password: process.env.DB_TEST_PASSWORD,
    server: process.env.DB_TEST_SERVER,
    database: process.env.DB_TEST_DATABASE,
    options: process.env.DB_TEST_OPTIONS
  },
  production: {
    username: process.env.DB_PRODUCTION_USERNAME,
    password: process.env.DB_PRODUCTION_PASSWORD,
    server: process.env.DB_PRODUCTION_SERVER,
    database: process.env.DB_PRODUCTION_DATABASE,
    options: process.env.DB_PRODUCTION_OPTIONS
  }
}
