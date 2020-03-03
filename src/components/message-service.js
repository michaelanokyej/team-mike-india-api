const messageService = {
  getAllMessages(knex) {
    return knex.select("*").from("messages");
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
  getById(knex, id) {
    return knex
      .from("messages")
      .select("*")
      .where("id", id)
      .first();
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
