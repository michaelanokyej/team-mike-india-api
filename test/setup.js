// process.env.NODE_ENV = 'test'
const { expect } = require('chai')
const supertest = require('supertest')

// process.env.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://dunder_mifflin@localhost/uplifttest'
// require('dotenv').config()
global.expect = expect
global.supertest = supertest

