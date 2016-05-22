apod-slack-lambda
=================

Send yourself the [Astronomy Picture of the Day][APOD] via Slack, with a
little help from [AWS Lambda][].

I created this to learn how to use Lambda to schedule a simple task. I wanted
the configuration to live in version control, and the whole thing to be
deployed automatically, so I decided to use ThoughtWorks Studios' nice library
[node-aws-lambda][].

I added functionality to automatically configure
[Lambda functions with scheduled events][schedule], which I later moved into
its own package, [node-aws-lambda-scheduler][].

[APOD]: http://apod.nasa.gov/apod/astropix.html
[AWS Lambda]: https://aws.amazon.com/lambda/
[node-aws-lambda]: https://github.com/ThoughtWorksStudios/node-aws-lambda
[schedule]: http://docs.aws.amazon.com/AmazonCloudWatch/latest/DeveloperGuide/RunLambdaSchedule.html
[node-aws-lambda-scheduler]: https://github.com/paulmelnikow/node-aws-lambda-scheduler


Deployment
----------

1. Clone this repository.
2. Set up your AWS credentials in `~/.aws/credentials`, if you haven't already.
3. If necessary, [create an IAM role for Lambda execution][IAM role].
4. Configure your Lambda execution IAM role in `./lambda-config.js`.
5. Optional: Adjust the ScheduleExpression in `./lambda-config.js`.
6. Configure an incoming webhook integration in Slack. Copy
   `./secrets.template.js` to `./secrets.js`, which is gitignored, and
   fill it in.
7. Optional: To avoid rate limits with NASA's demo key,
   [obtain your own NASA API key][NASA API key] and configure it in
    `./secrets.js`.
8. Deploy: `node_modules/.bin/gulp deploy`

[IAM role]: http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-service.html#roles-creatingrole-service-console
[NASA API key]: https://api.nasa.gov/


Contribute
----------

- Issue Tracker: https://github.com/paulmelnikow/apod-slack-lambda/issues
- Source Code: https://github.com/paulmelnikow/apod-slack-lambda

Pull requests welcome!


Support
-------

If you are having issues, please let me know.


License
-------

The project is licensed under the MIT license.
