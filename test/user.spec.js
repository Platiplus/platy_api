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
  const mockUser = {
    username: casual.username,
    email: casual.email,
    password: casual.password,
    initialBalance: Math.random() * (9999 - 1) + 1
  }

  before(async () => {
    const db = new Database()
    await db.connect('test')
    await User.deleteMany({})
  })

  describe('/POST User Creation', () => {
    it('it should create an user', (done) => {
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
    it('it should give an error when input with missing properties is provided', (done) => {
      const util = new Utils()
      const entries = Object.entries(mockUser)
      let user = Object.fromEntries(entries)

      user = util.chaoticInputGenerator(user)
      chai.request(server)
        .post('/user/create')
        .send(user)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(400)
          expect(res.error).not.to.be.null()
          done()
        })
    })
    it('it should give an error when trying to create an user that already exists', (done) => {
      chai.request(server)
        .post('/user/create')
        .send(mockUser)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(409)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('message').equal('User Already Exists')
          done()
        })
    })
  })
})
