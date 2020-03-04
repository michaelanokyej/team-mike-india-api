const logger = require("../logger");

const NO_ERRORS = null;

function getCommentValidationError({ comment, userid, postid }) {
  if (!comment) {
    logger.error(`Invalid comment '${comment}' supplied`);
    return {
      error: {
        message: `'comment' must be entered`
      }
    };
  } else if (!userid) {
    logger.error(`Invalid user id '${userid}' supplied`);
    return {
      error: {
        message: `'userID' must be entered`
      }
    };
  } else if (!postid) {
    logger.error(`Invalid post id '${postid}' supplied`);
    return {
      error: {
        message: `'postid' must be entered`
      }
    };
  }
}

module.exports = {
  getCommentValidationError
};
