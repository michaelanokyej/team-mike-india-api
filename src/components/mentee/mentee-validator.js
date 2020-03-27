const logger = require("../../logger");

const NO_ERRORS = null;

function getMenteeValidationError({ userid, mentorid }) {
  if (!userid) {
    logger.error(`Invalid userID '${userid}' supplied`);
    return {
      error: {
        message: `'userID' must be entered`
      }
    };
  } else if (!mentorid) {
    logger.error(`Invalid mentorID '${mentorid}' supplied`);
    return {
      error: {
        message: `'mentorID' must be entered`
      }
    };
  }
}

module.exports = {
  getMenteeValidationError
};
