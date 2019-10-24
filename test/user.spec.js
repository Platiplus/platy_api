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
  let registeredUser

  before(async () => {
    const db = new Database()
    await db.connect('test')
    await User.deleteMany({})
  })

  describe('/POST /users/', () => {
    it('it should create an user', (done) => {
      chai.request(server)
        .post('/users/')
        .send(mockUser)
        .end((err, res) => {
          registeredUser = res.body.data
          expect(err).to.be.null()
          expect(res).to.have.status(201)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('message').equal('User Created succesfully!')
          done()
        })
    })
    it('it should fail when input with missing properties is provided', (done) => {
      const util = new Utils()
      const entries = Object.entries(mockUser)
      let user = Object.fromEntries(entries)

      user = util.chaoticInputGenerator(user)
      chai.request(server)
        .post('/users/')
        .send(user)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(400)
          expect(res.error).not.to.be.null()
          done()
        })
    })
    it('it should fail when trying to create an user that already exists', (done) => {
      chai.request(server)
        .post('/users/')
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
  describe('/GET /user/:id?', () => {
    it('it should find a collection of users', (done) => {
      chai.request(server)
        .get('/users/')
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body.data).to.be.an('array')
          expect(res.body.error).to.be.false()
          done()
        })
    })
    it('it should find an specific user', (done) => {
      chai.request(server)
        .get(`/users/${registeredUser._id}`)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body.data).to.be.an('object')
          expect(res.body.error).to.be.false()
          done()
        })
    })
    it('it should fail if ObjectId is invalid', (done) => {
      chai.request(server)
        .get('/users/invalidObjectId')
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(400)
          expect(res.error).not.to.be.null()
          done()
        })
    })
  })
  describe('/DELETE /user/id', () => {
    it('it should delete an user from the database', (done) => {
      chai.request(server)
        .delete(`/users/${registeredUser._id}`)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(204)
          done()
        })
    })
    it('it should fail to delete an user that does not exists on the database', (done) => {
      chai.request(server)
        .delete(`/users/${registeredUser._id}`)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(404)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('message').equal('User not found on database')
          done()
        })
    })
  })
})
