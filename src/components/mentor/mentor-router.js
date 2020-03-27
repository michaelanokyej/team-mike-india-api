const express = require("express");
const path = require("path");
const xss = require("xss");
const mentorRouter = express.Router();
const bodyParser = express.json();
const logger = require("../../logger");
const mentorService = require("./mentor-service");
const { getMentorValidationError } = require("./mentor-validator");
const jwt = require("jsonwebtoken");

const serializementor = mentor => ({
  id: mentor.id,
  username: xss(mentor.username),
  // f_name: xss(mentor.first_name),
  // l_name: xss(mentor.last_name),
  email: xss(mentor.email),
  primaryuserid: xss(mentor.primaryuserid)
});

mentorRouter
  .route("/")

  .get((req, res, next) => {
    mentorService
      .getAllMentors(req.app.get("db"))
      .then(mentors => {
        res.json(mentors.map(serializementor));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { email, username, primaryuserid } = req.body;
    // const newmentor = { f_name, l_name, email, username, primaryuserid };
    const newmentor = { email, username, primaryuserid };

    // for (const field of ["f_name", "l_name", "email", "mentorname", "password"]) {
    for (const field of ["email", "username", "primaryuserid"]) {
      if (!newmentor[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        });
      }
    }

    const error = getMentorValidationError(newmentor);

    if (error) return res.status(400).send(error);

    mentorService
      .insertMentor(req.app.get("db"), newmentor)
      .then(mentor => {
        logger.info(`mentor with id ${mentor.id} created.`);
        res.status(201).json(serializementor(mentor));
      })
      .catch(next);
  });

mentorRouter
  .route("/:mentor_id")

  .all((req, res, next) => {
    const { mentor_id } = req.params;
    mentorService
      .getById(req.app.get("db"), mentor_id)
      .then(mentor => {
        if (!mentor) {
          logger.error(`mentor with id ${mentor_id} not found.`);
          return res.status(404).json({
            error: { message: `mentor Not Found` }
          });
        }

        res.mentor = mentor;
        next();
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json(serializementor(res.mentor));
  })

  .delete((req, res, next) => {
    const { mentor_id } = req.params;
    mentorService
      .deletementor(req.app.get("db"), mentor_id)
      .then(numRowsAffected => {
        logger.info(`mentor with id ${mentor_id} deleted.`);
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(bodyParser, (req, res, next) => {
    // const { f_name, l_name, email, password } = req.body;
    const { email, username, primaryuserid } = req.body;
    // const mentorToUpdate = { f_name, l_name, email, password };
    const mentorToUpdate = { email, username, primaryuserid };

    const numberOfValues = Object.values(mentorToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      logger.error(`Invalid update without required fields`);
      return res.status(400).json({
        error: {
          message: `Request body must content either 'username', 'email', or 'primaryuserid'`
        }
      });
    }

    const error = getMentorValidationError(mentorToUpdate);

    if (error) return res.status(400).send(error);

    mentorService
      .updateMentor(req.app.get("db"), req.params.mentor_id, mentorToUpdate)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = mentorRouter;
