const express = require("express");
const path = require("path");
const xss = require("xss");
const messageRouter = express.Router();
const bodyParser = express.json();
const logger = require("../logger");
const messageService = require("./message-service");
const { getMessageValidationError } = require("./message-validator");
const jwt = require("jsonwebtoken");

const serializemessage = message => ({
  id: message.id,
  userid: xss(message.userid),
  channelid: xss(message.channelid),
  messages: xss(message.messages),
  posted: xss(message.posted)
});

messageRouter
  .route("/")

  .get((req, res, next) => {
    messageService
      .getAllMessages(req.app.get("db"))
      .then(messages => {
        res.json(messages.map(serializemessage));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { messages, userid, channelid } = req.body;
    const newmessage = { messages, userid, channelid };

    for (const field of ["message", "userid", "channelid"]) {
      if (!newmessage[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        });
      }
    }

    const error = getMessageValidationError(newmessage);

    if (error) return res.status(400).send(error);

    messageService
      .insertMessage(req.app.get("db"), newmessage)
      .then(message => {
        logger.info(`message with id ${message.id} created.`);
        res.status(201).json(serializemessage(message));
      })
      .catch(next);
  });

messageRouter
  .route("/:message_id")

  .all((req, res, next) => {
    const { message_id } = req.params;
    messageService
      .getById(req.app.get("db"), message_id)
      .then(message => {
        if (!message) {
          logger.error(`message with id ${message_id} not found.`);
          return res.status(404).json({
            error: { message: `message Not Found` }
          });
        }

        res.message = message;
        next();
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json(serializemessage(res.message));
  })

  .delete((req, res, next) => {
    const { message_id } = req.params;
    messageService
      .deleteMessage(req.app.get("db"), message_id)
      .then(numRowsAffected => {
        logger.info(`message with id ${message_id} deleted.`);
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(bodyParser, (req, res, next) => {
    const { messages, userid, channelid } = req.body;
    const messageToUpdate = { messages, userid, channelid };

    const numberOfValues = Object.values(messageToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      logger.error(`Invalid update without required fields`);
      return res.status(400).json({
        error: {
          message: `Request body must content either 'userid, 'channelid' or 'message'`
        }
      });
    }

    const error = getMessageValidationError(messageToUpdate);

    if (error) return res.status(400).send(error);

    messageService
      .updatemessage(req.app.get("db"), req.params.message_id, messageToUpdate)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = messageRouter;
