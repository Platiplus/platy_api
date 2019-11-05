/* eslint-env mocha */
require('dotenv').config()

// UTILS AND MODELS
const Database = require('../utils/Database')

// DEV DEPENDENCIES
const chai = require('chai')
const expect = chai.expect
const dirtyChai = require('dirty-chai')
const chaiHttp = require('chai-http')

// MIDDLEWARES
chai.use(chaiHttp)
chai.use(dirtyChai)

describe('Database', () => {
  describe('DB Instance', () => {
    it('it should be an object (Class)', (done) => {
      const db = new Database()
      expect(db).to.be.a('object')
      done()
    })
  })
  describe('DB Connection', () => {
    it('it should connect successfully to the provided database', (done) => {
      const db = new Database()
      db.connect(process.env.DB_TEST_DATABASE).then((conn) => {
        expect(conn.connections.length).to.be.greaterThan(0)
        expect(conn.connections[0].db.databaseName).to.be.equal(process.env.DB_TEST_DATABASE)
        done()
      })
    })
    it('it should connect to the development database if no environment is provided', (done) => {
      const db = new Database()
      db.connect().then((conn) => {
        expect(conn.connections.length).to.be.greaterThan(0)
        expect(conn.connections[0].db.databaseName).to.be.equal(process.env.DB_DEV_DATABASE)
        done()
      })
    })
  })
})
