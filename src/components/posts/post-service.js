const postService = {
  getAllPosts(knex) {
    return knex.select("*").from("posts").orderBy('posts.posted', 'desc');
  },
  insertPost(knex, newPost) {
    return knex
      .insert(newPost)
      .into("posts")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex
      .from("posts")
      .select("*")
      .where("id", id)
      .first();
  },
  getByUserName(knex, Postname) {
    return knex
      .from("users")
      .select("*")
      .where("username", Postname)
      .first();
  },
  getByPostEmail(knex, PostEmail) {
    return knex
      .from("users")
      .select("*")
      .where("email", PostEmail)
      .first();
  },
  deletePost(knex, id) {
    return knex("posts")
      .where({ id })
      .delete();
  },
  updatePost(knex, id, newPostFields) {
    return knex("posts")
      .where({ id })
      .update(newPostFields);
  }
};

module.exports = postService;
