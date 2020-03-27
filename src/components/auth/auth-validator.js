const logger = require("../../logger");

const NO_ERRORS = null;

function getAuthValidationError({ email, password }) {
  const include_flag = email.split("").includes("@");

  if (!email) {
    logger.error(`No email supplied`);
    return {
      error: {
        message: `Email must be entered`
      }
    };
  } else if (!include_flag) {
    logger.error(`Invalid email '${email}' supplied`);
    return {
      error: {
        message: `A valid email must be entered`
      }
    };
  } else if (!password) {
    logger.error(`Invalid first name '${password}' supplied`);
    return {
      error: {
        message: `password must be entered`
      }
    };
  }
}

module.exports = {
  getAuthValidationError
};
