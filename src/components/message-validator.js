const logger = require("../logger");

const NO_ERRORS = null;

function getMessageValidationError({ messages, recipient_id, sender_id }) {
  if (!messages) {
    logger.error(`Invalid messages '${messages}' supplied`);
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
  } else if (!sender_id) {
    logger.error(`Invalid sender id '${sender_id}' supplied`);
    return {
      error: {
        message: `'senderID' must be entered`
      }
    };
  }
}

module.exports = {
  getMessageValidationError
};
