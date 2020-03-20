const logger = require("../logger");

const NO_ERRORS = null;

function getMessageValidationError({ author_id, recipient_id, message_body }) {
  if (!message_body) {
    logger.error(`Invalid messages '${message_body}' supplied`);
    return {
      error: {
        message: `'messages' must be entered`
      }
    };
  } else if (!recipient_id) {
    logger.error(`Invalid recipient id '${recipient_id}' supplied`);
    return {
      error: {
        message: `'recipientID' must be entered`
      }
    };
  } else if (!author_id) {
    logger.error(`Invalid author id '${author_id}' supplied`);
    return {
      error: {
        message: `'authorID' must be entered`
      }
    };
  }
}

module.exports = {
  getMessageValidationError
};
