module.exports = {
    region: 'us-west-2',
    handler: 'index.handler',
    role: 'arn:aws:iam::264010187327:role/LambdaExecution',
    functionName: 'ApodSlack',
    timeout: 10,
    memorySize: 128,
    // publish: true,
    runtime: 'nodejs4.3',
    cloudWatchEvent: {
        Name: '10am',
        // http://docs.aws.amazon.com/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html
        ScheduleExpression: 'cron(0 15 * * ? *)',
        // ScheduleExpression: 'rate(5 minutes)',
    },
};
