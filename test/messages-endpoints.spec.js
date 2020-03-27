require('dotenv').config()
const app = require('../src/app')
const knex = require('knex')
const { makeMessagesArray } = require('./messages-fixtures')

describe(`Messages Endpoints`, function () {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db.raw('TRUNCATE messages, user_followers, messages, posts, comments  RESTART IDENTITY CASCADE'))

    afterEach('cleanup', () => db.raw('TRUNCATE messages, user_followers, messages, posts, comments RESTART IDENTITY CASCADE'))

    describe('GET /api/messages', () => {
        context(`Given no Messages`, () => {

            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/messages')
                    .expect(200, [])
            })
        })

        context(`Given there are Messages in the database`, () => {
            const testMessages = makeMessagesArray()

            beforeEach(() => {
                return db
                    .into('messages')
                    .insert(testMessages)
            })

            it(`GET /api/messages responds with 200 and all of the Messages`, () => {
                return supertest(app)
                    .get('/api/messages')
                    .expect(200, testMessages)
            })
        })
    })

    describe('GET /api/messages/:user_id', () => {

        context(`Given no Messages`, () => {
            it(`Responds with 404`, () => {
                const userId = 123456
                return supertest(app)
                    .get(`/api/messages/${userId}`)
                    .expect(404);
            })
        })

        context(`Given there are Messages in the database`, () => {
            const testMessages = makeMessagesArray()

            beforeEach(() => {
                return db
                    .into('messages')
                    .insert(testMessages)
            })

            it(`responds with 200 and the specified folder`, () => {
                const userId = 3
                const expectedUser = testMessages[userId - 1]

                return supertest(app)
                    .get(`/api/messages/${userId}`)
                    .expect(200, expectedUser)
            })
        })
    })

    describe('POST /api/messages', () => {
        it(`creates a user, responding with 201 and the new user`, () => {
            const newUser = {
              username: "test4user",
              first_name: "test4",
              last_name: "user",
              email: "test4@user.com",
              password: "testpass4"
            }
            return supertest(app)
                .post('/api/messages')
                .send(newUser)
                .expect(201)
                .expect(res => {
                    expect(res.body.username).to.eql(newUser.username)
                    expect(res.body).to.have.property('id')
                })
                .then(res =>
                    supertest(app)
                        .get(`/api/messages/${res.body.id}`)
                        .expect(res.body)
                )
        })

        it(`responds with 400 and an error message when the 'username' is missing`, () => {
            return supertest(app)
                .post('/api/messages')
                .send({
                  first_name: "michael",
                  last_name: "Anokye",
                    password: "pass",
                    email: "manokye@gmail.com"
                })
                .expect(400, {
                    error: { message: "'username' is required" }
                })
        })
    })
})