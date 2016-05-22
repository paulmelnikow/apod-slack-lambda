// Based on an example in `node-aws-lambda`.
// https://github.com/ThoughtWorksStudios/node-aws-lambda

const gulp = require('gulp');
const zip = require('gulp-zip');
const del = require('del');
const install = require('gulp-install');
const runSequence = require('run-sequence');
const awsLambdaDeploy = require('pify')(require('node-aws-lambda').deploy);
const LambdaScheduler = require('node-aws-lambda-scheduler').LambdaScheduler;

gulp.task('clean', function () {
    return del(['./dist', './dist.zip']);
});

gulp.task('js', function () {
    return gulp.src([
            'secrets.js',
            'apod-to-slack/*.js',
        ], { base: '.' })
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

    const lambdaScheduler = new LambdaScheduler({
        region: lambdaConfig.region,
        functionName: lambdaConfig.functionName,
        ruleName: lambdaConfig.cloudWatchEvent.Name,
        scheduleExpression: lambdaConfig.cloudWatchEvent.ScheduleExpression,
    });

    awsLambdaDeploy('./dist.zip', lambdaConfig)
        .then(() => lambdaScheduler.schedule())
        .then(callback)
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
