require("dotenv").config();
const app = require("../src/app");
const knex = require("knex");
const { makeMessagesArray } = require("./messages-fixtures");
const { makeUsersArray } = require("./users-fixtures");

describe(`Messages Endpoints`, function() {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () =>
    db.raw(
      "TRUNCATE users, user_followers, messages, posts, comments  RESTART IDENTITY CASCADE"
    )
  );

  afterEach("cleanup", () =>
    db.raw(
      "TRUNCATE users, user_followers, messages, posts, comments RESTART IDENTITY CASCADE"
    )
  );

  describe("GET /api/messages", () => {
    context(`Given no Messages`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/messages")
          .expect(200, []);
      });
    });

    context(`Given there are Messages in the database`, () => {
      const testMessages = makeMessagesArray();
      const testUsers = makeUsersArray();

      const expectedThing = testMessages.map(testMessage => {
        return {
          id: testMessage.id,
          author_id: testMessage.author_id,
          recipient_id: testMessage.recipient_id,
          created_at: testMessage.created_at,
          message_body: testMessage.message_body
        };
      });

      const testObj = {
        id: 1,
        author_id: "1",
        created_at: new Date(),
        recipient_id: "2",
        message_body: "take it easy"
    }

      beforeEach(() => {
        return db.into("users").insert(testUsers);
      });

      beforeEach(() => {
        return db.into("messages").insert(testObj);
      });

      it(`GET /api/messages responds with 200 and all of the Messages`, () => {
        return (
          supertest(app)
            .get("/api/messages")
            .expect(res => {
              expect(res.body.author_id).to.eql(testObj.author_id);
              expect(res.body.recipient_id).to.eql(testObj.recipient_id);
              expect(res.body.created_at).to.not.eql(testObj.created_at);
              expect(res.body.message_body).to.eql(testObj.message_body);
              expect(res.body.id).to.eql(testObj.id);
            })
        );
        // .expect.fail("custom error message")
      });
    });
  });

  // describe('GET /api/messages/:user_id', () => {

  //     context(`Given no Messages`, () => {
  //         it(`Responds with 404`, () => {
  //             const userId = 123456
  //             return supertest(app)
  //                 .get(`/api/messages/${userId}`)
  //                 .expect(404);
  //         })
  //     })

  //     context(`Given there are Messages in the database`, () => {
  //         const testMessages = makeMessagesArray()

  //         beforeEach(() => {
  //             return db
  //                 .into('messages')
  //                 .insert(testMessages)
  //         })

  //         it(`responds with 200 and the specified folder`, () => {
  //             const userId = 3
  //             const expectedUser = testMessages[userId - 1]

  //             return supertest(app)
  //                 .get(`/api/messages/${userId}`)
  //                 .expect(200, expectedUser)
  //         })
  //     })
  // })

  // describe('POST /api/messages', () => {
  //     it(`creates a user, responding with 201 and the new user`, () => {
  //         const newUser = {
  //           username: "test4user",
  //           first_name: "test4",
  //           last_name: "user",
  //           email: "test4@user.com",
  //           password: "testpass4"
  //         }
  //         return supertest(app)
  //             .post('/api/messages')
  //             .send(newUser)
  //             .expect(201)
  //             .expect(res => {
  //                 expect(res.body.username).to.eql(newUser.username)
  //                 expect(res.body).to.have.property('id')
  //             })
  //             .then(res =>
  //                 supertest(app)
  //                     .get(`/api/messages/${res.body.id}`)
  //                     .expect(res.body)
  //             )
  //     })

  //     it(`responds with 400 and an error message when the 'username' is missing`, () => {
  //         return supertest(app)
  //             .post('/api/messages')
  //             .send({
  //               first_name: "michael",
  //               last_name: "Anokye",
  //                 password: "pass",
  //                 email: "manokye@gmail.com"
  //             })
  //             .expect(400, {
  //                 error: { message: "'username' is required" }
  //             })
  //     })
  // })
});
