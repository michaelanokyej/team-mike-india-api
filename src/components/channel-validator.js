const logger = require("../logger");

const NO_ERRORS = null;

function getChannelValidationError({ channel_name }) {
  if (!channel_name) {
    logger.error(`Invalid channel '${channel_name}' supplied`);
    return {
      error: {
        message: `'channel name' must be entered`
      }
    };
  } 
}

module.exports = {
  getChannelValidationError
};
