DROP TABLE IF EXISTS user_followers;

-- alter users table
ALTER TABLE users ADD CONSTRAINT unique_email_address UNIQUE (email);

-- create the user_followers table with the foreign key
CREATE TABLE user_followers (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  userid INTEGER REFERENCES users(id) ON DELETE CASCADE,
  followerid INTEGER REFERENCES users(id) ON DELETE CASCADE,
  connectionid INTEGER UNIQUE
);