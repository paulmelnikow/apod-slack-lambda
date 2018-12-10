# config

This folder contains the configuration for `apod-slack-lambda`.

The settings are provided in `default.yml`, which you can modify.

It's a good practice to exclude secrets from revision control. Accordingly,
the secrets are provided in `local.yml`, which takes precedence over
`default.yml`. `local.yml` is gitignored.

To get distinct configuration for production and test, you can create e.g.
`test.yml` and `local-test.yml`. Set `NODE_ENV=test` when deploying and those
settings will take effect.

Finally, for continuous delivery, it's convenient to place your secrets in
environment variables in your CI/CD environment. That is possible too. The env
vars to set are declared in `custom-environment-variables.yml`.

Cascading configs are cool! For more details, see the
[`node-config` documentation][docs].

[docs]: https://github.com/lorenwest/node-config/wiki/Configuration-Files#file-load-order
