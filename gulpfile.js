// Based on an example in `node-aws-lambda`.
// https://github.com/ThoughtWorksStudios/node-aws-lambda

const gulp = require('gulp');
const zip = require('gulp-zip');
const del = require('del');
const install = require('gulp-install');
const runSequence = require('run-sequence');
const awsLambda = require('node-aws-lambda');
const pify = require('pify');
const cloudWatchEventSource = require('./cloud-watch-event-source');

gulp.task('clean', function () {
    return del(['./dist', './dist.zip']);
});

gulp.task('js', function () {
    return gulp.src(['index.js', 'secrets.js', 'cloud-watch-event-source.js', 'apod-to-slack.js'])
        .pipe(gulp.dest('dist/'));
});

gulp.task('node-mods', function () {
    return gulp.src('./package.json')
        .pipe(gulp.dest('dist/'))
        .pipe(install({ production: true }));
});

gulp.task('zip', function () {
    return gulp.src(['dist/**/*', '!dist/package.json'])
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('./'));
});

gulp.task('upload', function (callback) {
    const lambdaConfig = require('./lambda-config');

    pify(awsLambda.deploy)('./dist.zip', lambdaConfig)
        .then(function () {
            return cloudWatchEventSource.update(
                { region: lambdaConfig.region },
                lambdaConfig.cloudWatchEvent);
        })
        .then(function () {
            return cloudWatchEventSource.addRule(
                { region: lambdaConfig.region },
                { region: lambdaConfig.region },
                lambdaConfig.cloudWatchEvent.Name,
                lambdaConfig.functionName);
        })
        .then(function () {
            console.log('done');

            callback();
        })
        .catch(callback);
});

gulp.task('deploy', function (callback) {
    return runSequence(
        ['clean'],
        ['js', 'node-mods'],
        ['zip'],
        ['upload'],
        callback
    );
});
