require("dotenv").config();
const app = require("../src/app");
const knex = require("knex");
const { makePostsArray } = require("./posts-fixtures");
const { makeUsersArray } = require("./users-fixtures");
const { makeCommentsArray } = require("./comments-fixtures");

describe(`Comments Endpoints`, function () {
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

    describe("GET /api/comments", () => {
        context(`Given no comments`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get("/api/comments")
                    .expect(200, []);
            });
        });

        context(`Given there are Comments in the database`, () => {
            const testPosts = makePostsArray();
            const testUsers = makeUsersArray();
            const testComments = makeCommentsArray();

            const expectedThing = testComments.map(testComment => {
                return {
                    id: testComment.id,
                    userid: testComment.userid,
                    postid: testComment.postid,
                    comment: testComment.comment,
                    posted: testComment.posted
                };
            });

            beforeEach(() => {
                return db.into("users").insert(testUsers);
            });

            beforeEach(() => {
                return db.into("posts").insert(testPosts);
            });

            beforeEach(() => {
                return db.into("comments").insert(expectedThing);
            });

            it(`GET /api/comments responds with 200 and all of the Comments`, () => {
                return (
                    supertest(app)
                        .get("/api/comments")
                        .expect(res => {
                            expect(res.body.id).to.eql(expectedThing.id);
                            expect(res.body.userid).to.eql(expectedThing.userid);
                            expect(res.body.postid).to.eql(expectedThing.postid);
                            expect(res.body.comment).to.eql(expectedThing.comment);
                            expect(res.body.posted).to.eql(expectedThing.posted);
                        })
                );
            });
        });
    });

    describe('POST /api/comments', () => {
        const testUsers = makeUsersArray();
        const testPosts = makePostsArray();

        beforeEach(() => {
            return db.into("users").insert(testUsers);
        });
        beforeEach(() => {
            return db.into("posts").insert(testPosts);
        });

        it(`creates a comment, responding with 201 and the new comment`, () => {
            this.retries(3)
            const newComment = {
                userid: "2",
                postid: "1",
                comment: "new comment test",
            }
            return supertest(app)
                .post('/api/comments')
                .set('Content-Type', 'application/json')
                .send(newComment)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.userid).to.eql(newComment.userid);
                    expect(res.body.postid).to.eql(newComment.postid);
                    expect(res.body.comment).to.eql(newComment.comment);
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
                            expect(res.body.userid).to.eql(newComment.userid);
                            expect(res.body.postid).to.eql(newComment.postid);
                            expect(res.body.comment).to.eql(newComment.comment);
                            const expectedDate = new Date().toLocaleString()
                            const actualDate = new Date(res.body.posted).toLocaleString()
                            expect(actualDate).to.eql(expectedDate)
                        })
                )
        })

        it(`responds with 400 and an error message when the 'comment' is missing`, () => {
            return supertest(app)
                .post('/api/comments')
                .send({
                    userid: '3',
                    postid: '2'
                })
                .expect(400, {
                    error: { message: "'comment' is required" }
                })
        })
    })
});
