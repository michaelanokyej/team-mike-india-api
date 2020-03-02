const mentorService = {
  getAllMentors(knex) {
    return knex.select("*").from("mentors");
  },
  insertMentor(knex, newMentor) {
    return knex
      .insert(newMentor)
      .into("mentors")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex
      .from("mentors")
      .select("*")
      .where("id", id)
      .first();
  },
  getByUserName(knex, Mentorname) {
    return knex
      .from("mentors")
      .select("*")
      .where("username", Mentorname)
      .first();
  },
  getByMentorEmail(knex, MentorEmail) {
    return knex
      .from("mentors")
      .select("*")
      .where("email", MentorEmail)
      .first();
  },
  deleteMentor(knex, id) {
    return knex("mentors")
      .where({ id })
      .delete();
  },
  updateMentor(knex, id, newMentorFields) {
    return knex("mentors")
      .where({ id })
      .update(newMentorFields);
  }
};

module.exports = mentorService;
