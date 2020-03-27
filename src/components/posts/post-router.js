const express = require("express");
const path = require("path");
const xss = require("xss");
const postRouter = express.Router();
const bodyParser = express.json();
const logger = require("../../logger");
const postService = require("./post-service");
const { getPostValidationError } = require("./post-validator");
const jwt = require("jsonwebtoken");

const serializepost = post => ({
  id: post.id,
  userid: xss(post.userid),
  post: xss(post.post),
  posted: xss(post.posted)
});

postRouter
  .route("/")

  .get((req, res, next) => {
    postService
      .getAllPosts(req.app.get("db"))
      .then(posts => {
        res.json(posts.map(serializepost));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { post, userid } = req.body;
    const newpost = { post, userid };

    for (const field of ["post", "userid"]) {
      if (!newpost[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        });
      }
    }

    const error = getPostValidationError(newpost);

    if (error) return res.status(400).send(error);

    postService
      .insertPost(req.app.get("db"), newpost)
      .then(post => {
        logger.info(`post with id ${post.id} created.`);
        res.status(201).json(serializepost(post));
      })
      .catch(next);
  });

postRouter
  .route("/:post_id")

  .all((req, res, next) => {
    const { post_id } = req.params;
    postService
      .getById(req.app.get("db"), post_id)
      .then(post => {
        if (!post) {
          logger.error(`post with id ${post_id} not found.`);
          return res.status(404).json({
            error: { message: `post Not Found` }
          });
        }

        res.post = post;
        next();
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json(serializepost(res.post));
  })

  .delete((req, res, next) => {
    const { post_id } = req.params;
    postService
      .deletePost(req.app.get("db"), post_id)
      .then(numRowsAffected => {
        logger.info(`post with id ${post_id} deleted.`);
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(bodyParser, (req, res, next) => {
    const { post, userid } = req.body;
    const postToUpdate = { post, userid };

    const numberOfValues = Object.values(postToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      logger.error(`Invalid update without required fields`);
      return res.status(400).json({
        error: {
          message: `Request body must content either 'userid'or 'post'`
        }
      });
    }

    const error = getPostValidationError(postToUpdate);

    if (error) return res.status(400).send(error);

    postService
      .updatePost(req.app.get("db"), req.params.post_id, postToUpdate)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = postRouter;
