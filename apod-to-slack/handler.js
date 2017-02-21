'use strict';

const apod = require('nasa-apod');
const Slack = require('slack-node');

const apodToSlack = require('./apod-to-slack');

// At deploy time, the `config` step validates the runtime config and
// generates `runtime-config.json`, which is packed into the code bundle.
//
// This is mainly to exclude the deploy configuration from the code bundle.
const config = require('../runtime-config.json');

module.exports.handler = (event, context, callback) => {
  const apodClient = new apod.Client({ apiKey: config.nasa.apiKey });

  const slackClient = new Slack();
  slackClient.setWebhook(config.slack.webhookUri);

  apodToSlack(apodClient, slackClient)
    .then(callback)
    .catch(function (err) {
      console.log(err);
      console.log(err.stack);

      callback(err);
    });
};
