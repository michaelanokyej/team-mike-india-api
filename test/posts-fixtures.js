function makePostsArray() {
    return [
        {
            id: 1,
            userid: "3",
            post: "test 1",
            posted: new Date()
        },
        {
            id: 2,
            userid: "2",
            post: "test 2",
            posted: new Date()
        },
        {
            id: 3,
            userid: "1",
            post: "test 3",
            posted: new Date()
        }
    ]
}

module.exports = {
    makePostsArray
}