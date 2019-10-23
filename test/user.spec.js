/* eslint-env mocha */

// UTILS AND MODELS
const Database = require('../utils/Database')
const Utils = require('../utils/Utils')
const User = require('../api/models/user-model')

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

// USER RELATED TESTS
describe('User', () => {
  before(async () => {
    const db = new Database()
    await db.connect('test')
    await User.deleteMany({})
  })

  describe('/POST User Creation', () => {
    it('it should create an user', (done) => {
      const mockUser = {
        username: casual.username,
        email: casual.email,
        password: casual.password,
        initialBalance: Math.random() * (9999 - 1) + 1
      }
      chai.request(server)
        .post('/user/create')
        .send(mockUser)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(201)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('message').equal('User Created succesfully!')
          done()
        })
    })
    it('it should give an error when invalid input is provided', (done) => {
      const util = new Utils()
      let mockUser = {
        username: casual.username,
        email: casual.email,
        password: casual.password,
        initialBalance: Math.random() * (9999 - 1) + 1
      }
      mockUser = util.chaoticInputGenerator(mockUser)
      chai.request(server)
        .post('/user/create')
        .send(mockUser)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(422)
          expect(res.error).not.to.be.null()
          done()
        })
    })
  })
})
