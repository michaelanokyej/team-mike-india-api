const messageService = {
  getAllMessages(knex) {
    // return knex.select("*").from("messages");

    return knex.select('*')
    .from('messages')
    .join('users_messages', 'messages.id', 'users_messages.message_id')
    .join('users', 'messages.sender_id', 'users.id')
    .then(response => {
      console.log(response)
      return response
    })
    .catch(err => {
      console.log('error:', err)
    });
  },
  insertMessage(knex, newmessage) {
    return knex
      .insert(newmessage)
      .into("messages")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  insertUserMessage(knex, newUserMessage) {
    return knex
      .insert(newUserMessage)
      .into("users_messages")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex
      .from("messages")
      .select("*")
      .where("sender_id", id)
  },
  getByUserName(knex, username) {
    return knex
      .from("users")
      .select("*")
      .where("username", username)
      .first();
  },
  getByUserEmail(knex, userEmail) {
    return knex
      .from("users")
      .select("*")
      .where("email", userEmail)
      .first();
  },
  deleteMessage(knex, id) {
    return knex("messages")
      .where({ id })
      .delete();
  },
  updateMessage(knex, id, newmessageFields) {
    return knex("messages")
      .where({ id })
      .update(newmessageFields);
  }
};

module.exports = messageService;
