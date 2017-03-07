const inquirer = require('inquirer');
const fs = require('fs');
const gulp = require('./gulp');
const flow = require('./flow');
const shouldSkipCheck = require('./args').shouldSkipCheck;

if (shouldSkipCheck()) {
  flow();
} else {
  const configPath = `${process.cwd()}/.flowcheck`;
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  if (!config.include) {
    throw new Error('.flowcheck must have an includes property');
  }

  gulp.check(config.include, (nonFlowCount) => {
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
        return gulp.change(config.include, () => flow(config['flow-bin']));
      }

      return flow();
    });
  });
}
