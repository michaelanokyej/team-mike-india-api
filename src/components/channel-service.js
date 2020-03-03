const channelService = {
  getAllChannels(knex) {
    return knex.select("*").from("channels");
  },
  insertChannel(knex, newChannel) {
    return knex
      .insert(newChannel)
      .into("channels")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex
      .from("channels")
      .select("*")
      .where("id", id)
      .first();
  },
  getByChannelName(knex, Channelname) {
    return knex
      .from("channels")
      .select("*")
      .where("Channel_name", Channelname)
      .first();
  },
  getByChannelEmail(knex, ChannelEmail) {
    return knex
      .from("users")
      .select("*")
      .where("email", ChannelEmail)
      .first();
  },
  deleteChannel(knex, id) {
    return knex("channels")
      .where({ id })
      .delete();
  },
  updateChannel(knex, id, newChannelFields) {
    return knex("channels")
      .where({ id })
      .update(newChannelFields);
  }
};

module.exports = channelService;
