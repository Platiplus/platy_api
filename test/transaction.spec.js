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

// MIDDLEWARES
chai.use(chaiHttp)
chai.use(dirtyChai)

// USER RELATED TESTS
describe('Transaction', () => {
  let mockUser = {
    _id: mongoose.Types.ObjectId(),
    username: casual.username,
    email: casual.email,
    password: casual.password,
    initialBalance: Math.random() * (9999 - 1) + 1
  }

  const mockTransaction = {
    type: 1,
    date: '12/12/2019',
    description: casual.text,
    target: casual.username,
    value: Math.random() * (500 - 1) + 1,
    category: casual.word,
    status: casual.boolean,
    quotas: 'null',
    account: '5dd0707ce84e9d15fb892fdd'
  }

  let createdTransaction
  let auth

  before(async () => {
    const db = new Database()
    await db.connect()
    await User.deleteMany({})
    const postUser = Object.fromEntries(Object.entries(mockUser));
    delete postUser._id;

    await chai.request(server)
      .post('/users/')
      .send(postUser);

    auth = await axios.post(`${process.env.AUTH_URL}/signin`, 
        { 
          email: mockUser.email,
          password: mockUser.password
        })
    auth = `Bearer ${ auth.data }`
  })

  describe('/POST /transactions/', () => {
    it('it should create a transaction', (done) => {
      chai.request(server)
        .post(`/transactions/`)
        .set('authorization', auth)
        .send(mockTransaction)
        .end((err, res) => {
          createdTransaction = res.body.createdTransaction
          expect(err).to.be.null()
          expect(res).to.have.status(201)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('message').equal('Transaction created succesfully!')
          done()
        })
    })
    it('it should fail when input with missing properties is provided', (done) => {
      const util = new Utils()
      const entries = Object.entries(mockTransaction)
      let transaction = Object.fromEntries(entries)
      transaction = util.chaoticInputGenerator(transaction)
      chai.request(server)
        .post(`/transactions/`)
        .set('authorization', auth)
        .send(transaction)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(400)
          expect(res.error).not.to.be.null()
          done()
        })
    })
    it('it should fail when date is invalid, even in valid formatting', (done) => {
      const entries = Object.entries(mockTransaction)
      const transaction = Object.fromEntries(entries)
      transaction.date = '99/99/9999'
      chai.request(server)
        .post(`/transactions/`)
        .set('authorization', auth)
        .send(transaction)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(400)
          expect(res.error).not.to.be.null()
          done()
        })
    })
  })
  describe('/GET /transactions/all', () => {
    it('it should find a collection of transactions from a specific user', (done) => {
      chai.request(server)
        .get(`/transactions/all/`)
        .set('authorization', auth)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body.transactions).to.be.an('array')
          done()
        })
    })
  })
  describe('/GET /transactions/:id', () => {
    it('it should find a specific transaction', (done) => {
      chai.request(server)
        .get(`/transactions/${createdTransaction._id}`)
        .set('authorization', auth)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body.transaction).to.be.an('object')
          done()
        })
    })
    it('it should fail to find a transaction that does not exists on the database', (done) => {
      chai.request(server)
        .get(`/transactions/${mongoose.Types.ObjectId()}`)
        .set('authorization', auth)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(404)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('message').equal('Transaction not found on database')
          done()
        })
    })
    it('it should fail to find a transaction if ObjectId is invalid', (done) => {
      chai.request(server)
        .get('/transactions/invalidObjectId')
        .set('authorization', auth)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(400)
          expect(res.error).not.to.be.null()
          done()
        })
    })
  })
  describe('/PATCH /transactions/:id', () => {
    it('it should patch a specific transaction', (done) => {
      chai.request(server)
        .patch(`/transactions/${createdTransaction._id}`)
        .set('authorization', auth)
        .send({ description: 'Updated transaction' })
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body.transaction).to.be.an('object')
          done()
        })
    })
    it('it should fail to patch a transaction that does not exists on the database', (done) => {
      chai.request(server)
        .patch(`/transactions/${mongoose.Types.ObjectId()}`)
        .set('authorization', auth)
        .send({ description: 'Updated transaction' })
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(404)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('message').equal('Transaction not found on database')
          done()
        })
    })
    it('it should fail to patch a transaction if there are no properties on the request', (done) => {
      chai.request(server)
        .patch(`/transactions/${createdTransaction._id}`)
        .set('authorization', auth)
        .send({})
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(400)
          expect(res.error).not.to.be.null()
          done()
        })
    })
    it('it should fail to patch a transaction if there are unknow properties on the request', (done) => {
      chai.request(server)
        .patch(`/transactions/${createdTransaction._id}`)
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
        .patch('/transactions/invalidObjectId')
        .set('authorization', auth)
        .send({ description: 'Updated transaction' })
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(400)
          expect(res.error).not.to.be.null()
          done()
        })
    })
    it('it should fail when date is invalid, even in valid formatting', (done) => {
      const entries = Object.entries(mockTransaction)
      const transaction = Object.fromEntries(entries)
      transaction.date = '99/99/9999'
      chai.request(server)
        .patch(`/transactions/${createdTransaction._id}`)
        .set('authorization', auth)
        .send(transaction)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(400)
          expect(res.error).not.to.be.null()
          done()
        })
    })
  })
  describe('/DELETE /transactions/:id', () => {
    it('it should delete a transaction from the database', (done) => {
      chai.request(server)
        .delete(`/transactions/${createdTransaction._id}`)
        .set('authorization', auth)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('message').equal('Transaction deleted successfully')
          done()
        })
    })
    it('it should fail to delete a transaction that does not exists on the database', (done) => {
      chai.request(server)
        .delete(`/transactions/${mongoose.Types.ObjectId()}`)
        .set('authorization', auth)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(404)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('message').equal('Transaction not found on database')
          done()
        })
    })
    it('it should fail to delete if ObjectId is invalid', (done) => {
      chai.request(server)
        .delete('/transactions/invalidObjectId')
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
