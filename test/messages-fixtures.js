function makeMessagesArray() {
  return [
    {
        id: 1,
        author_id: "1",
        created_at: new Date(),
        recipient_id: "2",
        message_body: "take it easy"
    },
    {
        id: 2,
        author_id: "2",
        created_at: new Date(),
        recipient_id: "1",
        message_body: "hows it going"
    },
    {
        id: 3,
        author_id: "1",
        created_at: new Date(),
        recipient_id: "2",
        message_body: "call me"
    }
]
}

module.exports = {
  makeMessagesArray
}