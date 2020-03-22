const userFollowerService = {
  getAllUserFollowers(knex) {
    return knex.select("*").from("user_followers");
  },
  insertUserFollower(knex, newUser) {
    return knex
      .insert(newUser)
      .into("user_followers")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex
      .from("user_followers")
      .select("*")
      .where("id", id)
      .first();
  },
  deleteUserFollower(knex, id) {
    return knex("user_followers")
      .where({ id })
      .delete();
  }
};

module.exports = userFollowerService;
