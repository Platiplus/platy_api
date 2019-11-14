const moment = require('moment')

class Utils {
  chaoticInputGenerator (target) {
    var properties = Object.keys(target)
    delete target[properties[properties.length * Math.random() << 0]]
    return target
  }

  normalizeDate (date) {
    const parsedDate = moment(date, 'DD/MM/YYYY')
    if (parsedDate.isValid()) {
      return parsedDate.format('YYYY-MM-DD')
    }
    return undefined
  }
}

module.exports = Utils
