const express = require("express");
const path = require("path");
const xss = require("xss");
const messageRouter = express.Router();
const bodyParser = express.json();
const logger = require("../../logger");
const messageService = require("./message-service");
const { getMessageValidationError } = require("./message-validator");
const jwt = require("jsonwebtoken");

const serializemessage = message => ({
  id: message.id,
  author_id: xss(message.author_id),
  recipient_id: xss(message.recipient_id),
  created_at: xss(message.created_at),
  message_body: xss(message.message_body)
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
    const { author_id, recipient_id, message_body } = req.body;
    const newmessage = { author_id, recipient_id, message_body };
    for (const field of ["author_id", "recipient_id", "message_body"]) {
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
  .route("/:messageID")

  .delete((req, res, next) => {
    const { messageID } = req.params;
    messageService
      .deleteMessage(req.app.get("db"), messageID)
      .then(numRowsAffected => {
        logger.info(`message with id ${messageID} deleted.`);
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(bodyParser, (req, res, next) => {
    const { messages, userid, channelid } = req.body;
    const messageToUpdate = { messages, userid, channelid };

    const numberOfValues = Object.values(messageToUpdate).filter(Boolean)
      .length;
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
