// DEPENDENCIES
const winston = require('winston')
require('winston-daily-rotate-file')

// LOG OPTIONS
const errorLogger = new (winston.transports.DailyRotateFile)({
  level: 'error',
  filename: './logs/API_%DATE%_ERROR-LOG.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  colorize: true
})

// CREATING THE LOGGER
const logger = winston.createLogger({
  transports: [
    errorLogger
  ],
  exitOnError: false
})
// STREAM PROPERTY FOR LOGGING
logger.stream = {
  write: function (message) {
    logger.debug(message)
  }
}
// EXPORTING THE LOGGER TO THE APP
module.exports = logger
