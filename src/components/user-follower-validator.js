const logger = require("../logger");

const NO_ERRORS = null;

function getUserFollowerValidationError({ userid, followerid, connectionid }) {
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
  } else if (!connectionid) {
    logger.error(`Invalid connection id '${connectionid}' supplied`);
    return {
      error: {
        message: `'The special connection id' must be entered`
      }
    };
  }
}

module.exports = {
  getUserFollowerValidationError
};
