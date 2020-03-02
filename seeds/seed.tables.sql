-- first remove any data that may be present
TRUNCATE users,
mentors,
posts,
comments,
channels,
user_followers,
channel_members,
messages,
mentees RESTART IDENTITY CASCADE;

-- insert some users
INSERT INTO
  users (first_name, last_name, username, email, password)
VALUES
  (
    'Test',
    'User1',
    'testuser1',
    'testuser1@yahoo.com',
    'testpass'
  ),
  (
    'Test',
    'User2',
    'testuser2',
    'testuser2@yahoo.com',
    'testpass'
  ),
  (
    'Test',
    'User3',
    'testuser3',
    'testuser3@yahoo.com',
    'testpass'
  ),
  (
    'Test',
    'User4',
    'testuser4',
    'testuser4@yahoo.com',
    'testpass'
  );

-- insert some mentors
INSERT INTO
  mentors (username, email, primaryUserID)
VALUES
  (
    'testuser1',
    'testuser1@yahoo.com',
    1
  ),
  (
    'testuser2',
    'testuser2@yahoo.com',
    2
  ),
  (
    'testuser3',
    'testuser3@yahoo.com',
    3
  ),
  (
    'testuser4',
    'testuser4@yahoo.com',
    4
  );

-- insert some posts
INSERT INTO
  posts (userID, post)
VALUES
  (
    1,
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua.'
  ),
  (
    2,
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua.'
  ),
  (
    3,
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua.'
  ),
  (
    4,
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua.'
  );

-- insert some comments
INSERT INTO
  comments (userID, postID, comment)
VALUES
  (
    2,
    3,
    'Lorem ipsum dolor sit amet, consectetur adipisicing.'
  ),
  (
    3,
    4,
    'Lorem ipsum dolor sit amet, consectetur adipisicing.'
  ),
  (
    4,
    2,
    'Lorem ipsum dolor sit amet, consectetur adipisicing.'
  ),
  (
    1,
    1,
    'Lorem ipsum dolor sit amet, consectetur adipisicing.'
  );

-- insert some channels
INSERT INTO
  channels (channel_name)
VALUES
  ('test_channel1'),
  ('test_channel2'),
  ('test_channel3'),
  ('test_channel4');

-- insert some user_followers
INSERT INTO
  user_followers (userID, followerID)
VALUES
  (1, 2),
  (2, 1),
  (3, 2),
  (4, 3);

-- insert some channel_members
INSERT INTO
  channel_members (channelID, userID)
VALUES
  (1, 2),
  (2, 2),
  (3, 2),
  (4, 2),
  (1, 1),
  (2, 1),
  (3, 1),
  (4, 1);

-- insert some messages
INSERT INTO
  messages (userID, channelID, messages)
VALUES
  (
    1,
    1,
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod'
  ),
  (
    2,
    2,
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod'
  ),
  (
    3,
    3,
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod'
  ),
  (
    4,
    4,
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod'
  );

-- insert some mentees
INSERT INTO
  mentees (userID, mentorID)
VALUES
  (1, 2),
  (2, 2),
  (3, 2),
  (4, 2),
  (1, 1),
  (2, 1),
  (3, 1),
  (4, 1);