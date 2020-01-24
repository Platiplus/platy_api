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

  createTransactionQuery (params) {
    const query = {}

    query.owner = params.userId

    if ('type' in params) {
      query.type = params.type
    }

    if ('target' in params) {
      query.target = params.target
    }

    if ('category' in params) {
      query.category = params.category
    }

    if ('status' in params) {
      query.status = params.status
    }

    if ('quotas' in params) {
      query.quotas = params.quotas
    }

    if ('dateStart' in params) {
      query.date.$gt = params.dateStart
    }

    if ('dateEnd' in params) {
      query.date.$lt = params.dateEnd
    }

    return query
  }
}

module.exports = Utils
