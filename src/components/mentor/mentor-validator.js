const logger = require("../../logger");

const NO_ERRORS = null;

function getMentorValidationError({ email, username, primaryuserid }) {
  const include_flag = email.split("").includes("@");

  if (!include_flag) {
    logger.error(`Invalid email '${email}' supplied`);
    return {
      error: {
        message: `'A valid email' must be entered`
      }
    };
  } else if (!username) {
    logger.error(`Invalid username '${username}' supplied`);
    return {
      error: {
        message: `'username' must be entered`
      }
    };
  } else if (!primaryuserid) {
    logger.error(`Invalid user id '${primaryuserid}' supplied`);
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
