const pify = require('pify');
const AWS = require('aws-sdk');
const _ = require('underscore');

const update = function (cloudWatchAttrs, attrs) {
    const cloudWatchEvents = new AWS.CloudWatchEvents(cloudWatchAttrs);

    const listRules = pify(cloudWatchEvents.listRules.bind(cloudWatchEvents));
    const putRule = pify(cloudWatchEvents.putRule.bind(cloudWatchEvents));

    return listRules({})
        .then(function (rules) {
            const matching = _(rules.Rules).findWhere({
                Name: attrs.Name,
                ScheduleExpression: attrs.ScheduleExpression,
            });

            if (matching) {
                return matching.Arn;
            }

            return putRule(attrs)
                .then(function (data) {
                    return data.RuleArn;
                });
        });
};

const addRule = function (cloudWatchAttrs, lambdaAttrs, ruleName, functionName) {
    const cloudWatchEvents = new AWS.CloudWatchEvents(cloudWatchAttrs);
    const lambda = new AWS.Lambda(lambdaAttrs);

    const getFunction = pify(lambda.getFunction.bind(lambda));
    const putTargets = pify(cloudWatchEvents.putTargets.bind(cloudWatchEvents));

    return getFunction({ FunctionName: functionName })
        .then(function (functionData) {
            return functionData.Configuration.FunctionArn;
        })
        .then(function (functionArn) {
            return putTargets({
                Rule: ruleName,
                Targets: [{
                    Id: '1',
                    Arn: functionArn,
                }],
            });
        });
};

module.exports = {
    update,
    addRule,
};
