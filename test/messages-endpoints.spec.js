require("dotenv").config();
const app = require("../src/app");
const knex = require("knex");
const { makeMessagesArray } = require("./messages-fixtures");
const { makeUsersArray } = require("./users-fixtures");

describe(`Messages Endpoints`, function () {
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

      beforeEach(() => {
        return db.into("users").insert(testUsers);
      });

      beforeEach(() => {
        return db.into("messages").insert(expectedThing);
      });

      it(`GET /api/messages responds with 200 and all of the Messages`, () => {
        return (
          supertest(app)
            .get("/api/messages")
            .expect(res => {
              expect(res.body.id).to.eql(expectedThing.id);
              expect(res.body.author_id).to.eql(expectedThing.author_id);
              expect(res.body.recipient_id).to.eql(expectedThing.recipient_id);
              expect(res.body.created_at).to.eql(expectedThing.created_at);
              expect(res.body.message_body).to.eql(expectedThing.message_body);
            })
        );
      });
    });
  });

  describe('POST /api/messages', () => {
    const testUsers = makeUsersArray();
    beforeEach(() => {
      return db.into("users").insert(testUsers);
    });

    it(`creates a message, responding with 201 and the new message`, () => {
      this.retries(3)
      const newMessage = {
        author_id: "2",
        recipient_id: "1",
        message_body: "test new message"
      }
      return supertest(app)
        .post('/api/messages')
        .send(newMessage)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.author_id).to.eql(newMessage.author_id);
          expect(res.body.recipient_id).to.eql(newMessage.recipient_id);
          expect(res.body.message_body).to.eql(newMessage.message_body);
          const expectedDate = new Date().toLocaleString()
          const actualDate = new Date(res.body.created_at).toLocaleString()
          expect(actualDate).to.eql(expectedDate)
        })
        .expect(res =>
          db
            .from('messages')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.author_id).to.eql(newMessage.author_id)
              expect(row.recipient_id).to.eql(newMessage.recipient_id)
              expect(row.message_body).to.eql(newMessage.message_body)
              const expectedDate = new Date().toLocaleString()
              const actualDate = new Date(row.created_at).toLocaleString()
              expect(actualDate).to.eql(expectedDate)
            })
        )
    })

    it(`responds with 400 and an error message when the 'author_id' is missing`, () => {
      return supertest(app)
        .post('/api/messages')
        .send({
          first_name: "michael",
          last_name: "Anokye",
          password: "pass",
          email: "manokye@gmail.com"
        })
        .expect(400, {
          error: { message: "'author_id' is required" }
        })
    })
  })
});
