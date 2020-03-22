const express = require("express");
const path = require("path");
const xss = require("xss");
const userFollowersRouter = express.Router();
const bodyParser = express.json();
const logger = require("../logger");
const userFollowerService = require("./user-follower-service");
const { getUserFollowerValidationError } = require("./user-follower-validator");
const jwt = require("jsonwebtoken");

const serializeuser = user => ({
  connectionid: user.id,
  userid: user.userid,
  followerid: user.followerid
});

userFollowersRouter
  .route("/")

  .get((req, res, next) => {
    userFollowerService
      .getAllUserFollowers(req.app.get("db"))
      .then(userfollowers => {
        res.json(userfollowers.map(serializeuser));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { userid, followerid } = req.body;
    const newUserFollower = { userid, followerid };

    for (const field of ["userid", "followerid"]) {
      if (!newUserFollower[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        });
      }
    }

    const error = getUserFollowerValidationError(newUserFollower);

    if (error) return res.status(400).send(error);

    userFollowerService
      .insertUserFollower(req.app.get("db"), newUserFollower)
      .then(connection => {
        logger.info(`user with id ${connection.id} created.`);
        res.status(201).json(serializeuser(connection));
      })
      .catch(next);
  });

userFollowersRouter
  .route("/:user_id")

  .all((req, res, next) => {
    const { user_id } = req.params;
    userFollowerService
      .getById(req.app.get("db"), user_id)
      .then(user => {
        if (!user) {
          logger.error(`user with id ${user_id} not found.`);
          return res.status(404).json({
            error: { message: `user Not Found` }
          });
        }

        res.user = user;
        next();
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json(serializeuser(res.user));
  })

  .delete((req, res, next) => {
    const { user_id } = req.params;
    userFollowerService
      .deleteUser(req.app.get("db"), user_id)
      .then(numRowsAffected => {
        logger.info(`user with id ${user_id} deleted.`);
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(bodyParser, (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;
    const userToUpdate = { first_name, last_name, email, password };

    const numberOfValues = Object.values(userToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      logger.error(`Invalid update without required fields`);
      return res.status(400).json({
        error: {
          message: `Request body must content either 'user_name', 'folder_id', or 'content'`
        }
      });
    }

    const error = getUserFollowerValidationError(userToUpdate);

    if (error) return res.status(400).send(error);

    userFollowerService
      .updateUser(req.app.get("db"), req.params.user_id, userToUpdate)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = userFollowersRouter;
