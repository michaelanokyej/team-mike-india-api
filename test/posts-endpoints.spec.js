require("dotenv").config();
const app = require("../src/app");
const knex = require("knex");
const { makePostsArray } = require("./posts-fixtures");
const { makeUsersArray } = require("./users-fixtures");

describe(`Posts Endpoints`, function () {
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

    describe("GET /api/posts", () => {
        context(`Given no Posts`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get("/api/posts")
                    .expect(200, []);
            });
        });

        context(`Given there are Posts in the database`, () => {
            const testPosts = makePostsArray();
            const testUsers = makeUsersArray();

            const expectedThing = testPosts.map(testPost => {
                return {
                    id: testPost.id,
                    userid: testPost.userid,
                    post: testPost.post,
                    posted: testPost.posted
                };
            });

            beforeEach(() => {
                return db.into("users").insert(testUsers);
            });

            beforeEach(() => {
                return db.into("posts").insert(expectedThing);
            });

            it(`GET /api/posts responds with 200 and all of the Posts`, () => {
                return (
                    supertest(app)
                        .get("/api/posts")
                        .expect(res => {
                            expect(res.body.id).to.eql(expectedThing.id);
                            expect(res.body.userid).to.eql(expectedThing.userid);
                            expect(res.body.post).to.eql(expectedThing.post);
                            expect(res.body.posted).to.eql(expectedThing.posted);
                        })
                );
            });
        });
    });

    describe('POST /api/posts', () => {
        const testUsers = makeUsersArray();
        beforeEach(() => {
            return db.into("users").insert(testUsers);
        });

        it(`creates a post, responding with 201 and the new post`, () => {
            this.retries(3)
            const newPost = {
                userid: "2",
                post: "new post test"
            }
            return supertest(app)
                .post('/api/posts')
                .set('Content-Type', 'application/json')
                .send(newPost)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.userid).to.eql(newPost.userid);
                    expect(res.body.post).to.eql(newPost.post);
                    const expectedDate = new Date().toLocaleString()
                    const actualDate = new Date(res.body.posted).toLocaleString()
                    expect(actualDate).to.eql(expectedDate)
                })
                .expect(res =>
                    db
                        .from('posts')
                        .select('*')
                        .where({ id: res.body.id })
                        .first()
                        .then(row => {
                            expect(res.body).to.have.property('id')
                            expect(res.body.userid).to.eql(newPost.userid);
                            expect(res.body.post).to.eql(newPost.post);
                            const expectedDate = new Date().toLocaleString()
                            const actualDate = new Date(res.body.posted).toLocaleString()
                            expect(actualDate).to.eql(expectedDate)
                        })
                )
        })

        it(`responds with 400 and an error message when the 'post' is missing`, () => {
            return supertest(app)
                .post('/api/posts')
                .send({
                    userid: '3'
                })
                .expect(400, {
                    error: { message: "'post' is required" }
                })
        })
    })
});
