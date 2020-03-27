function makeMessagesArray() {
  return [
    {
        // id: 1,
        author_id: 2,
        recipient_id: 1,
        created_at: "Fri Mar 20 2020 17:19:51",
        message_body: "take it easy"
    },
    {
        // id: 2,
        author_id: 3,
        recipient_id: 1,
        created_at: "Fri Mar 20 2020 17:19:51",
        message_body: "hows it going"
    },
    {
        // id: 3,
        author_id: 2,
        recipient_id: 3,
        created_at: "Fri Mar 20 2020 17:19:51",
        message_body: "call me"
    }
]
}

module.exports = {
  makeMessagesArray
}