function makeCommentsArray() {
    return [
        {
            id: 1,
            userid: "2",
            postid: "3",
            comment: "Lorem ipsum dolor sit amet.",
            posted: new Date()
        },
        {
            id: 2,
            userid: "1",
            postid: "2",
            comment: "Lorem ipsum dolor sit amet, consectetur.",
            posted: new Date()
        },
        {
            id: 3,
            userid: "3",
            postid: "1",
            comment: "Lorem ipsum dolor sit amet, consectetur adipisicing.",
            posted: new Date()
        }
    ]
}

module.exports = {
    makeCommentsArray
}