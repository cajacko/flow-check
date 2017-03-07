#! /usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs');
const gulp = require('./gulp');
const flow = require('./flow');
const shouldSkipCheck = require('./args').shouldSkipCheck;

if (shouldSkipCheck()) {
  flow();
} else {
  const configPath = `${process.cwd()}/.flowcheck`;
  let config;
  let include = [
    '**/*.js',
    '!node_modules/**/*',
    '!**/*.min.js',
    '!public/**/*',
    '!dist/**/*'
  ];

  try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (err) {
    console.log('No .flowcheck file, using defaults');
  }

  if (config) {
    if (config.include) {
      include = config.include;
    } else {
      throw new Error('.flowcheck must have an includes property');
    }
  }

  gulp.check(include, (nonFlowCount) => {
    if (nonFlowCount === 0) {
      return flow();
    }

    console.log(`Files to change: ${nonFlowCount}`);

    return inquirer.prompt([
      {
        type: 'confirm',
        name: 'change',
        message: 'Do you want to add flow type support to these files?',
        default: true
      }
    ]).then((answers) => {
      if (answers.change) {
        return gulp.change(include, () => flow());
      }

      return flow();
    });
  });
}
