const apod = require('nasa-apod');
const Slack = require('slack-node');

const apodToSlack = require('./apod-to-slack');

const secrets = require('../secrets');

module.exports.handler = (event, context, callback) => {
    const apodClient = new apod.Client({ apiKey: secrets.nasaApiKey });

    const slackClient = new Slack();
    slackClient.setWebhook(secrets.slackUri);

    apodToSlack(apodClient, slackClient)
        .then(callback)
        .catch(function (err) {
            console.log(err);
            console.log(err.stack);

            callback(err);
        });
};
