function makeUserFollowersArray() {
    return [
        {
            id: 1,
            userid: 2,
            followerid: 3,
            customid: 2101200
        },
        {
            id: 2,
            userid: 3,
            followerid: 1,
            customid: 2101201
        },
        {
            id: 3,
            userid: 1,
            followerid: 2,
            customid: 2101202
        }
    ]
}

module.exports = {
    makeUserFollowersArray
}