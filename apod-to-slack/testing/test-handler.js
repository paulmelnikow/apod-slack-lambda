'use strict'

const handler = require('./index').handler

handler(null, null, function() {})

// const slackClient = new Slack();
// slackClient.setWebhook(secrets.slackUri);

// sendSlack(slackClient, require('./mock-data.json'));
