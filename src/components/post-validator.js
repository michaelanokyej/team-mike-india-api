const logger = require("../logger");

const NO_ERRORS = null;

function getMentorValidationError({ post, userid }) {
  if (!post) {
    logger.error(`Invalid post '${post}' supplied`);
    return {
      error: {
        message: `'post' must be entered`
      }
    };
  } else if (!userid) {
    logger.error(`Invalid user id '${userid}' supplied`);
    return {
      error: {
        message: `'userID' must be entered`
      }
    };
  }
}

module.exports = {
  getMentorValidationError
};
