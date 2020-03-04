const express = require("express");
const path = require("path");
const xss = require("xss");
const commentRouter = express.Router();
const bodyParser = express.json();
const logger = require("../logger");
const commentService = require("./comment-service");
const { getCommentValidationError } = require("./comment-validator");
const jwt = require("jsonwebtoken");

const serializecomment = comment => ({
  id: comment.id,
  userid: xss(comment.userid),
  postid: xss(comment.postid),
  comment: xss(comment.comment),
  posted: xss(comment.posted)
});

commentRouter
  .route("/")

  .get((req, res, next) => {
    commentService
      .getAllComments(req.app.get("db"))
      .then(comments => {
        res.json(comments.map(serializecomment));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { comment, userid, postid } = req.body;
    const newcomment = { comment, userid, postid };

    for (const field of ["comment", "userid"]) {
      if (!newcomment[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        });
      }
    }

    const error = getCommentValidationError(newcomment);

    if (error) return res.status(400).send(error);

    commentService
      .insertcomment(req.app.get("db"), newcomment)
      .then(comment => {
        logger.info(`comment with id ${comment.id} created.`);
        res.status(201).json(serializecomment(comment));
      })
      .catch(next);
  });

commentRouter
  .route("/:comment_id")

  .all((req, res, next) => {
    const { comment_id } = req.params;
    commentService
      .getById(req.app.get("db"), comment_id)
      .then(comment => {
        if (!comment) {
          logger.error(`comment with id ${comment_id} not found.`);
          return res.status(404).json({
            error: { message: `comment Not Found` }
          });
        }

        res.comment = comment;
        next();
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json(serializecomment(res.comment));
  })

  .delete((req, res, next) => {
    const { comment_id } = req.params;
    commentService
      .deletecomment(req.app.get("db"), comment_id)
      .then(numRowsAffected => {
        logger.info(`comment with id ${comment_id} deleted.`);
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(bodyParser, (req, res, next) => {
    const { comment, userid, postid } = req.body;
    const commentToUpdate = { comment, userid, postid };

    const numberOfValues = Object.values(commentToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      logger.error(`Invalid update without required fields`);
      return res.status(400).json({
        error: {
          message: `Request body must content either 'userid'or 'comment'`
        }
      });
    }

    const error = getCommentValidationError(commentToUpdate);

    if (error) return res.status(400).send(error);

    commentService
      .updatecomment(req.app.get("db"), req.params.comment_id, commentToUpdate)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = commentRouter;
