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
  sender_id: xss(message.sender_id),
  send_date: xss(message.send_date),
  messages: xss(message.messages),
  notify_date: xss(message.notify_date),
  recipient_id: xss(message.recipient_id),
  is_read: xss(message.is_read),
  user_first_name: xss(message.first_name),
  user_last_name: xss(message.last_name),
  username: xss(message.username),
  email: xss(message.email)
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
    const { messages, recipient_id, sender_id } = req.body;
    const postedMessageBody = { messages, recipient_id, sender_id };
    const newmessage = { messages, sender_id };

    for (const field of ["messages", "recipient_id", "sender_id"]) {
      if (!postedMessageBody[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        });
      }
    }

    const error = getMessageValidationError(postedMessageBody);

    if (error) return res.status(400).send(error);

    messageService
      .insertMessage(req.app.get("db"), newmessage)
      .then(message => {
        // const postedMessage = {
        //   ...message
        // }
        const newlyPostedMessage = {};
        const newUserMessage = {
          recipient_id: recipient_id,
          message_id: message.id
        };
        messageService
          .insertUserMessage(req.app.get("db"), newUserMessage)
          .then(postedUserMessage => {
            const userMessage = {
              recipient_id: postedUserMessage.recipient_id
            };
            newlyPostedMessage = { ...message, ...userMessage };
            console.log(newlyPostedMessage);

            logger.info(`message with id ${newlyPostedMessage.id} created.`);
            res.status(201).json(serializemessage(newlyPostedMessage));
          });
        // const postedMessage = {
        //   ...message, recipient_id: userMessage.recipient_id
        // }
        // console.log(newlyPostedMessage)

        // logger.info(`message with id ${newlyPostedMessage.id} created.`);
        // res.status(201).json(serializemessage(newlyPostedMessage));
      })
      .catch(next);
  });

messageRouter
  .route("/:userid")

  .all((req, res, next) => {
    const { userid } = req.params;
    console.log(userid);
    messageService
      .getById(req.app.get("db"), userid)
      .then(messages => {
        if (!messages) {
          logger.error(`user with id ${userid} has no messages.`);
          return res.status(404).json({
            error: { message: `There was an error retrieving your messages.` }
          });
        }

        res.messages = messages;
        next();
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json(res.messages.map(serializemessage));
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
