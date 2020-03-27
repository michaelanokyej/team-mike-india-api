function makeUsersArray() {
  return [
    {
        id: 1,
        username: "michaelanokyej",
        first_name: "Michael",
        last_name: "Anokye",
        username: "tester1",
        email: "michaelanokyej@yahoo.com",
        password: "wanderpassword123"
    },
    {
        id: 2,
        username: "testuser2",
        first_name: "test",
        last_name: "user2",
        username: "tester2",
        email: "test2@user.com",
        password: "testpass"
    },
    {
        id: 3,
        username: "test3user",
        first_name: "test3",
        last_name: "user",
        username: "tester3",
        email: "test3@user.com",
        password: "testpass"
    }
  ]
}

module.exports = {
  makeUsersArray
}