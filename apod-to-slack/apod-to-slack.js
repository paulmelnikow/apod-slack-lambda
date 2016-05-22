const pify = require('pify');

const formatSlackMessage = require('./format-slack-message');

const apodToSlack = (apodClient, slackClient, date) => {
    return apodClient(date)
        .then(function (apodData) {
            console.log('APOD response:');
            console.log(JSON.stringify(apodData, null, 4));

            const slackMessage = formatSlackMessage(apodData);

            console.log('Slack message:');
            console.log(JSON.stringify(slackMessage, null, 4));

            return pify(slackClient.webhook)(slackMessage);
        })
        .then(function (response) {
            console.log('Slack response:');
            console.log(response);
        });
};

module.exports = apodToSlack;
