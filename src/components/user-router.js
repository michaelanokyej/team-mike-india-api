const express = require("express");
const path = require("path");
const xss = require("xss");
const userRouter = express.Router();
const bodyParser = express.json();
const logger = require("../logger");
const userService = require("./user-service");
const { getUserValidationError } = require("./user-validator");
const jwt = require("jsonwebtoken");

const serializeuser = user => ({
  id: user.id,
  username: xss(user.username),
  first_name: xss(user.first_name),
  last_name: xss(user.last_name),
  email: xss(user.email),
  password: xss(user.password)
});

userRouter
  .route("/")

  .get((req, res, next) => {
    userService
      .getAllUsers(req.app.get("db"))
      .then(users => {
        res.json(users.map(serializeuser));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { first_name, last_name, email, username, password } = req.body;
    const newUser = { first_name, last_name, email, username, password };

    for (const field of ["first_name", "last_name", "email", "username", "password"]) {
      if (!newUser[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        });
      }
    }

    const error = getUserValidationError(newUser);

    if (error) return res.status(400).send(error);

    userService
      .insertUser(req.app.get("db"), newUser)
      .then(user => {
        logger.info(`user with id ${user.id} created.`);
        res.status(201).json(serializeuser(user));
      })
      .catch(next);
  });

userRouter
  .route("/:user_id")

  .all((req, res, next) => {
    const { user_id } = req.params;
    userService
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
    userService
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

    const error = getUserValidationError(userToUpdate);

    if (error) return res.status(400).send(error);

    userService
      .updateUser(req.app.get("db"), req.params.user_id, userToUpdate)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = userRouter;
