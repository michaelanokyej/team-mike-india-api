require("dotenv").config();
const app = require("../src/app");
const knex = require("knex");
const { makeUsersArray } = require("./users-fixtures");
const { makeUserFollowersArray } = require("./userFollowers-fixtures");

describe(`UserFollowers Endpoints`, function () {
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

    describe("GET /api/userFollowers", () => {
        context(`Given no userFollowers`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get("/api/userFollowers")
                    .expect(200, []);
            });
        });

        context(`Given there are userFollowers in the database`, () => {
            const testUserFollowers = makeUserFollowersArray();
            const testUsers = makeUsersArray();

            const expectedThing = testUserFollowers.map(testUserFollower => {
                return {
                    id: testUserFollower.id,
                    userid: testUserFollower.userid,
                    followerid: testUserFollower.followerid,
                    customid: testUserFollower.customid,
                };
            });

            beforeEach(() => {
                return db.into("users").insert(testUsers);
            });

            beforeEach(() => {
                return db.into("user_followers").insert(expectedThing);
            });

            it(`GET /api/userFollowers responds with 200 and all of the userFollowers`, () => {
                return (
                    supertest(app)
                        .get("/api/userFollowers")
                        .expect(res => {
                            expect(res.body.id).to.eql(expectedThing.id);
                            expect(res.body.userid).to.eql(expectedThing.userid);
                            expect(res.body.followerid).to.eql(expectedThing.followerid);
                            expect(res.body.customid).to.eql(expectedThing.customid);
                        })
                );
            });
        });
    });

    describe('POST /api/userFollowers', () => {
        const testUsers = makeUsersArray();

        beforeEach(() => {
            return db.into("users").insert(testUsers);
        });


        it(`creates a userFollower, responding with 201`, () => {
            const newUserFollower = {
                userid: 2,
                followerid: 1,
                customid: 2101204,
            }
            return supertest(app)
                .post('/api/userFollowers')
                .send(newUserFollower)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('connectionid')
                    expect(res.body.userid).to.eql(newUserFollower.userid);
                    expect(res.body.followerid).to.eql(newUserFollower.followerid);
                    expect(res.body.customid).to.eql(newUserFollower.customid);
                })
                .expect(res =>
                    db
                        .from('user_followers')
                        .select('*')
                        .where({ id: res.body.id })
                        .first()
                        .then(row => {
                            expect(res.body).to.have.property('connectionid')
                            expect(res.body.userid).to.eql(newUserFollower.userid);
                            expect(res.body.followerid).to.eql(newUserFollower.followerid);
                            expect(res.body.customid).to.eql(newUserFollower.customid);
                        })
                )
        })

        it(`responds with 400 and an error message when the 'userid' is missing`, () => {
            return supertest(app)
                .post('/api/userFollowers')
                .send({
                    followerid: 2
                })
                .expect(400, {
                    error: { message: "'userid' is required" }
                })
        })
    })
});
