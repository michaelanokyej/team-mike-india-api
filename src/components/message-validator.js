const logger = require("../logger");

const NO_ERRORS = null;

function getMentorValidationError({ messages, userid, channelid }) {
  if (!messages) {
    logger.error(`Invalid messages '${messages}' supplied`);
    return {
      error: {
        message: `'messages' must be entered`
      }
    };
  } else if (!userid) {
    logger.error(`Invalid user id '${userid}' supplied`);
    return {
      error: {
        message: `'userID' must be entered`
      }
    };
  } else if (!channelid) {
    logger.error(`Invalid channel id '${channelid}' supplied`);
    return {
      error: {
        message: `'channelID' must be entered`
      }
    };
  }
}

module.exports = {
  getMentorValidationError
};
