const menteeService = {
  getAllMentees(knex) {
    return knex.select("*").from("mentees");
  },
  insertMentee(knex, newMentee) {
    return knex
      .insert(newMentee)
      .into("mentees")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex
      .from("mentees")
      .select("*")
      .where("id", id)
      .first();
  },
  getByUserName(knex, Menteename) {
    return knex
      .from("users")
      .select("*")
      .where("username", Menteename)
      .first();
  },
  getByMenteeEmail(knex, MenteeEmail) {
    return knex
      .from("users")
      .select("*")
      .where("email", MenteeEmail)
      .first();
  },
  deleteMentee(knex, id) {
    return knex("mentees")
      .where({ id })
      .delete();
  },
  updateMentee(knex, id, newMenteeFields) {
    return knex("mentees")
      .where({ id })
      .update(newMenteeFields);
  }
};

module.exports = menteeService;
