/* eslint-env mocha */
require('dotenv').config()
// UTILS AND MODELS
const Database = require('../utils/Database')
const Utils = require('../utils/Utils')
const User = require('../api/models/user-model')
const mongoose = require('mongoose')
const axios = require('axios').default

// DEV DEPENDENCIES
const casual = require('casual')
const chai = require('chai')
const expect = chai.expect
const dirtyChai = require('dirty-chai')
const chaiHttp = require('chai-http')
const server = require('../app')
let auth

// MIDDLEWARES
chai.use(chaiHttp)
chai.use(dirtyChai)

// ACCOUNT RELATED TESTS
describe('Account', () => {
  const mockUser = {
    _id: mongoose.Types.ObjectId(),
    username: casual.username,
    email: casual.email,
    password: casual.password,
    initialBalance: Math.random() * (9999 - 1) + 1
  }

  const mockAccount = {
    description: casual.short_description,
    balance: Math.random() * (9999 - 1) + 1
  }

  let createdAccount

  before(async () => {
    const db = new Database()
    await db.connect()
    await User.deleteMany({})
    const postUser = Object.fromEntries(Object.entries(mockUser))
    delete postUser._id

    await chai.request(server)
      .post('/users/')
      .send(postUser)

    auth = await axios.post(`${process.env.AUTH_URL}/signin`,
      {
        email: mockUser.email,
        password: mockUser.password
      })
    auth = `Bearer ${auth.data.token}`
  })

  describe('/POST /accounts/', () => {
    it('it should create an account', (done) => {
      chai.request(server)
        .post('/accounts/')
        .set('authorization', auth)
        .send(mockAccount)
        .end((err, res) => {
          createdAccount = res.body.accounts[0]
          expect(err).to.be.null()
          expect(res).to.have.status(201)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('message').equal('Account created succesfully!')
          done()
        })
    })
    it('it should fail when input with missing properties is provided', (done) => {
      const util = new Utils()
      const entries = Object.entries(mockAccount)
      let account = Object.fromEntries(entries)
      account = util.chaoticInputGenerator(account)
      chai.request(server)
        .post('/accounts/')
        .set('authorization', auth)
        .send(account)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(400)
          expect(res.error).not.to.be.null()
          done()
        })
    })
    it('it should fail when balance is invalid', (done) => {
      const entries = Object.entries(mockAccount)
      const account = Object.fromEntries(entries)
      account.balance = 'x98sh'
      chai.request(server)
        .post('/accounts/')
        .set('authorization', auth)
        .send(account)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(400)
          expect(res.error).not.to.be.null()
          done()
        })
    })
  })
  describe('/GET /accounts/user/:userId', () => {
    it('it should find a collection of accounts from a specific user', (done) => {
      chai.request(server)
        .get('/accounts/all')
        .set('authorization', auth)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body.accounts).to.be.an('array')
          done()
        })
    })
  })
  describe('/GET /accounts/:id', () => {
    it('it should find a specific account', (done) => {
      chai.request(server)
        .get(`/accounts/${createdAccount._id}`)
        .set('authorization', auth)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body.accounts).to.be.an('array')
          done()
        })
    })
    it('it should fail to find an account that does not exists on the database', (done) => {
      chai.request(server)
        .get(`/accounts/${mongoose.Types.ObjectId()}`)
        .set('authorization', auth)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(404)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('message').equal('Account not found on database')
          done()
        })
    })
    it('it should fail to find an account if ObjectId is invalid', (done) => {
      chai.request(server)
        .get('/accounts/invalidObjectId')
        .set('authorization', auth)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(400)
          expect(res.error).not.to.be.null()
          done()
        })
    })
  })
  describe('/PATCH /accounts/:id', () => {
    it('it should patch a specific account', (done) => {
      chai.request(server)
        .patch(`/accounts/${createdAccount._id}`)
        .set('authorization', auth)
        .send({ description: 'Updated account' })
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body.accounts).to.be.an('array')
          done()
        })
    })
    it('it should fail to patch an account that does not exists on the database', (done) => {
      chai.request(server)
        .patch(`/accounts/${mongoose.Types.ObjectId()}`)
        .set('authorization', auth)
        .send({ description: 'Updated account' })
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(404)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('message').equal('Account not found on database')
          done()
        })
    })
    it('it should fail to patch an account if there are no properties on the request', (done) => {
      chai.request(server)
        .patch(`/accounts/${createdAccount._id}`)
        .set('authorization', auth)
        .send({})
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(400)
          expect(res.error).not.to.be.null()
          done()
        })
    })
    it('it should fail to patch an account if there are unknow properties on the request', (done) => {
      chai.request(server)
        .patch(`/accounts/${createdAccount._id}`)
        .set('authorization', auth)
        .send({ malicious_property: 'hackerman' })
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(400)
          expect(res.error).not.to.be.null()
          done()
        })
    })
    it('it should fail to patch if ObjectId is invalid', (done) => {
      chai.request(server)
        .patch('/accounts/invalidObjectId')
        .set('authorization', auth)
        .send({ description: 'Updated account' })
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(400)
          expect(res.error).not.to.be.null()
          done()
        })
    })
    it('it should fail to patch if balance is invalid', (done) => {
      const entries = Object.entries(mockAccount)
      const account = Object.fromEntries(entries)
      account.balance = 'x98sh'
      chai.request(server)
        .patch(`/accounts/${createdAccount._id}`)
        .set('authorization', auth)
        .send(account)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(400)
          expect(res.error).not.to.be.null()
          done()
        })
    })
  })
  describe('/DELETE /accounts/:id', () => {
    it('it should delete an account from the database', (done) => {
      chai.request(server)
        .delete(`/accounts/${createdAccount._id}`)
        .set('authorization', auth)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('message').equal('Account deleted successfully')
          done()
        })
    })
    it('it should fail to delete an account that does not exists on the database', (done) => {
      chai.request(server)
        .delete(`/accounts/${mongoose.Types.ObjectId()}`)
        .set('authorization', auth)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(404)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('message').equal('Account not found on database')
          done()
        })
    })
    it('it should fail to delete if ObjectId is invalid', (done) => {
      chai.request(server)
        .delete('/accounts/invalidObjectId')
        .set('authorization', auth)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(400)
          expect(res.error).not.to.be.null()
          done()
        })
    })
  })
})
