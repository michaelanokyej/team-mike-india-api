require('dotenv').config()
const app = require('../src/app')
const knex = require('knex')
const { makeUsersArray } = require('./users-fixtures')

describe(`Users Endpoints`, function () {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db.raw('TRUNCATE users, user_followers, messages, posts, comments  RESTART IDENTITY CASCADE'))

    afterEach('cleanup', () => db.raw('TRUNCATE users, user_followers, messages, posts, comments RESTART IDENTITY CASCADE'))

    describe('GET /api/users', () => {
        context(`Given no users`, () => {

            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/users')
                    .expect(200, [])
            })
        })

        context(`Given there are users in the database`, () => {
            const testUsers = makeUsersArray()

            beforeEach(() => {
                return db
                    .into('users')
                    .insert(testUsers)
            })

            it(`GET /api/users responds with 200 and all of the users`, () => {
                return supertest(app)
                    .get('/api/users')
                    .expect(200, testUsers)
            })
        })
    })

    describe('GET /api/users/:user_id', () => {

        context(`Given no users`, () => {
            it(`Responds with 404`, () => {
                const userId = 123456
                return supertest(app)
                    .get(`/api/users/${userId}`)
                    .expect(404);
            })
        })

        context(`Given there are users in the database`, () => {
            const testUsers = makeUsersArray()

            beforeEach(() => {
                return db
                    .into('users')
                    .insert(testUsers)
            })

            it(`responds with 200 and the specified folder`, () => {
                const userId = 3
                const expectedUser = testUsers[userId - 1]

                return supertest(app)
                    .get(`/api/users/${userId}`)
                    .expect(200, expectedUser)
            })
        })
    })

    describe('POST /api/users', () => {
        it(`creates a user, responding with 201 and the new user`, () => {
            const newUser = {
              username: "test4user",
              first_name: "test4",
              last_name: "user",
              email: "test4@user.com",
              password: "testpass4"
            }
            return supertest(app)
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect(res => {
                    expect(res.body.username).to.eql(newUser.username)
                    expect(res.body).to.have.property('id')
                })
                .then(res =>
                    supertest(app)
                        .get(`/api/users/${res.body.id}`)
                        .expect(res.body)
                )
        })

        it(`responds with 400 and an error message when the 'username' is missing`, () => {
            return supertest(app)
                .post('/api/users')
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