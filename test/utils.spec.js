/* eslint-env mocha */
require('dotenv').config()

// UTILS AND MODELS
const Utils = require('../utils/Utils')
const util = new Utils();

// DEV DEPENDENCIES
const chai = require('chai')
const expect = chai.expect

describe('Utils', () => {
  describe('Query Params', () => {
    it('it should build a query object based on the passed request params', (done) => {
      const params = {
        owner: 'owner',
        type: 1,
        target: 'PaymentTarget',
        category: 'Category',
        status: 1,
        quotas: 'QuotaId',
        dateStart: '2020-02-06',
        dateEnd: '2020-02-29',
        account: '5dd0707ce84e9d15fb892fdd',
    }
      const query = util.createTransactionQuery(params)

      expect(query).to.be.an('object')
      expect(query).to.have.property('owner')
      expect(query).to.have.property('type')
      expect(query).to.have.property('target')
      expect(query).to.have.property('category')
      expect(query).to.have.property('status')
      expect(query).to.have.property('quotas')
      expect(query).to.have.property('date')
      expect(params).property('dateStart').to.not.equal(undefined)
      expect(params).property('dateEnd').to.not.equal(undefined)
      expect(query).property('date').to.have.property('$gt')
      expect(query).property('date').to.have.property('$lt')
      expect(query).to.have.property('account')
      done()
    })
  })
})
