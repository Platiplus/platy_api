/* eslint-env mocha */
require('dotenv').config()
// UTILS AND MODELS
const Database = require('../utils/Database')
const Utils = require('../utils/Utils')
const User = require('../api/models/user-model')
const mongoose = require('mongoose')

// DEV DEPENDENCIES
const casual = require('casual')
const chai = require('chai')
const expect = chai.expect
const dirtyChai = require('dirty-chai')
const chaiHttp = require('chai-http')
const server = require('../app')
const axios = require('axios').default

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
  let auth

  before(async () => {
    const db = new Database()
    await db.connect()
    await User.deleteMany({})
  })

  describe('/POST /users/', () => {
    it('it should create an user', (done) => {
      chai.request(server)
        .post('/users/')
        .send(mockUser)
        .end(async (err, res) => {
          auth = await axios.post(`${process.env.AUTH_URL}/signin`, 
            { 
              email: mockUser.email,
              password: mockUser.password
            })
          auth = `Bearer ${ auth.data }`
          expect(err).to.be.null()
          expect(res).to.have.status(201)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('message').equal('User created succesfully!')
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
  describe('/GET /users/all', () => {
    it('it should find a collection of users', (done) => {
      chai.request(server)
        .get('/users/all')
        .set('authorization', auth)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body.users).to.be.an('array')
          done()
        })
    })
  })
  describe('/GET /users/', () => {
    it('it should find a specific user', (done) => {
      chai.request(server)
        .get(`/users/`)
        .set('authorization', auth)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body.user).to.be.an('object')
          done()
        })
    })
  })
  describe('/PATCH /user/', () => {
    it('it should patch a specific user', (done) => {
      chai.request(server)
        .patch(`/users/`)
        .set('authorization', auth)
        .send({ username: 'test' })
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body.user).to.be.an('object')
          done()
        })
    })
    it('it should fail to patch an user if there are no properties on the request', (done) => {
      chai.request(server)
        .patch(`/users/`)
        .set('authorization', auth)
        .send({})
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(400)
          expect(res.error).not.to.be.null()
          done()
        })
    })
    it('it should fail to patch an user if there are unknow properties on the request', (done) => {
      chai.request(server)
        .patch(`/users/`)
        .set('authorization', auth)
        .send({ malicious_property: 'hackerman' })
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(400)
          expect(res.error).not.to.be.null()
          done()
        })
    })
  })
  describe('/DELETE /user/', () => {
    it('it should delete an user from the database', (done) => {
      chai.request(server)
        .delete(`/users/`)
        .set('authorization', auth)
        .end((err, res) => {
          expect(err).to.be.null()
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('message').equal('User deleted successfully')
          done()
        })
    })
  })
})
