/* eslint-env mocha */
require('dotenv').config()

// DEV DEPENDENCIES
const casual = require('casual')
const chai = require('chai')
const expect = chai.expect
const dirtyChai = require('dirty-chai')
const chaiHttp = require('chai-http')
const server = require('../app')

// MIDDLEWARES
chai.use(chaiHttp)
chai.use(dirtyChai)

describe('App', () => {
  describe('/GET Unknown route', () => {
    it('it should fail to serve a route that does not exits', (done) => {
      chai.request(server)
        .get(`/${casual.word}/`)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(404)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('message').equal('Route not found')
          expect(res.body.error).to.be.true()
          done()
        })
    })
  })
})
