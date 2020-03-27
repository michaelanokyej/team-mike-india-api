const logger = require("../../logger");

const NO_ERRORS = null;

function getUserFollowerValidationError({ userid, followerid, customid }) {
  if (!userid) {
    logger.error(`Invalid first name '${userid}' supplied`);
    return {
      error: {
        message: `'first name' must be entered`
      }
    };
  } else if (!followerid) {
    logger.error(`Invalid first name '${followerid}' supplied`);
    return {
      error: {
        message: `'last name' must be entered`
      }
    };
  } else if (!customid) {
    logger.error(`Invalid custom id '${customid}' supplied`);
    return {
      error: {
        message: `'The custom connection id' must be entered`
      }
    };
  }
}

module.exports = {
  getUserFollowerValidationError
};
