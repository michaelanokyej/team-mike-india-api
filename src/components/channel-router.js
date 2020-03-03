const express = require("express");
const path = require("path");
const xss = require("xss");
const channelRouter = express.Router();
const bodyParser = express.json();
const logger = require("../logger");
const channelService = require("./channel-service");
const { getChannelValidationError } = require("./channel-validator");
const jwt = require("jsonwebtoken");

const serializechannel = channel => ({
  id: channel.id,
  channel_name: xss(channel.channel_name),
});

channelRouter
  .route("/")

  .get((req, res, next) => {
    channelService
      .getAllChannels(req.app.get("db"))
      .then(channels => {
        res.json(channels.map(serializechannel));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { channel_name } = req.body;
    const newchannel = { channel_name };

    for (const field of [channel_name]) {
      if (!newchannel[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        });
      }
    }

    const error = getChannelValidationError(newchannel);

    if (error) return res.status(400).send(error);

    channelService
      .insertChannel(req.app.get("db"), newchannel)
      .then(channel => {
        logger.info(`channel with id ${channel.id} created.`);
        res.status(201).json(serializechannel(channel));
      })
      .catch(next);
  });

channelRouter
  .route("/:channel_id")

  .all((req, res, next) => {
    const { channel_id } = req.params;
    channelService
      .getById(req.app.get("db"), channel_id)
      .then(channel => {
        if (!channel) {
          logger.error(`channel with id ${channel_id} not found.`);
          return res.status(404).json({
            error: { message: `channel Not Found` }
          });
        }

        res.channel = channel;
        next();
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json(serializechannel(res.channel));
  })

  .delete((req, res, next) => {
    const { channel_id } = req.params;
    channelService
      .deleteChannel(req.app.get("db"), channel_id)
      .then(numRowsAffected => {
        logger.info(`channel with id ${channel_id} deleted.`);
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(bodyParser, (req, res, next) => {
    const { channel_name } = req.body;
    const channelToUpdate = { channel_name };

    const numberOfValues = Object.values(channelToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      logger.error(`Invalid update without required fields`);
      return res.status(400).json({
        error: {
          message: `Request body must contain 'channel_name'`
        }
      });
    }

    const error = getChannelValidationError(channelToUpdate);

    if (error) return res.status(400).send(error);

    channelService
      .updateChannel(req.app.get("db"), req.params.channel_id, channelToUpdate)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = channelRouter;
