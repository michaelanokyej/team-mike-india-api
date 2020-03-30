const express = require("express");
const path = require("path");
const xss = require("xss");
const menteeRouter = express.Router();
const bodyParser = express.json();
const logger = require("../../logger");
const menteeService = require("./mentee-service");
const { getMenteeValidationError } = require("./mentee-validator");
const jwt = require("jsonwebtoken");

const serializementee = mentee => ({
  id: mentee.id,
  userid: xss(mentee.userid),
  mentorid: xss(mentee.mentorid)
});

menteeRouter
  .route("/")

  .get((req, res, next) => {
    menteeService
      .getAllMentees(req.app.get("db"))
      .then(mentees => {
        res.json(mentees.map(serializementee));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { userid, mentorid } = req.body;
    const newmentee = { userid, mentorid };

    for (const field of ["userid", "mentor"]) {
      if (!newmentee[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        });
      }
    }

    const error = getMenteeValidationError(newmentee);

    if (error) return res.status(400).send(error);

    menteeService
      .insertMentee(req.app.get("db"), newmentee)
      .then(mentee => {
        logger.info(`mentee with id ${mentee.id} created.`);
        res.status(201).json(serializementee(mentee));
      })
      .catch(next);
  });

menteeRouter
  .route("/:mentee_id")

  .all((req, res, next) => {
    const { mentee_id } = req.params;
    menteeService
      .getById(req.app.get("db"), mentee_id)
      .then(mentee => {
        if (!mentee) {
          logger.error(`mentee with id ${mentee_id} not found.`);
          return res.status(404).json({
            error: { message: `mentee Not Found` }
          });
        }

        res.mentee = mentee;
        next();
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json(serializementee(res.mentee));
  })

  .delete((req, res, next) => {
    const { mentee_id } = req.params;
    menteeService
      .deleteMentee(req.app.get("db"), mentee_id)
      .then(numRowsAffected => {
        logger.info(`mentee with id ${mentee_id} deleted.`);
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(bodyParser, (req, res, next) => {
    const { email, username, primaryuserid } = req.body;
    const menteeToUpdate = { email, username, primaryuserid };

    const numberOfValues = Object.values(menteeToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      logger.error(`Invalid update without required fields`);
      return res.status(400).json({
        error: {
          message: `Request body must content either 'username', 'email', or 'primaryuserid'`
        }
      });
    }

    const error = getMenteeValidationError(menteeToUpdate);

    if (error) return res.status(400).send(error);

    menteeService
      .updateMentee(req.app.get("db"), req.params.mentee_id, menteeToUpdate)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = menteeRouter;
