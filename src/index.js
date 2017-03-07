const gulp = require('./gulp');
const inquirer = require('inquirer');
const spawn = require('child_process').spawnSync;
const fs = require('fs');

const configPath = `${process.cwd()}/.flowcheck`;
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

if (!config.include) {
  throw new Error('.flowcheck must have an includes property');
}

function flow(flowBin) {
  let flowCliPath = 'node_modules/flow-bin/cli.js';

  if (flowBin) {
    flowCliPath = flowBin;
  }

  const args = [flowCliPath];

  // Get all args and run flow with these
  return spawn('node', args, { cwd: process.cwd(), stdio: 'inherit' });
}

gulp.check(config.include, (nonFlowCount) => {
  if (nonFlowCount === 0) {
    return flow(config['flow-bin']);
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

    return flow(config['flow-bin']);
  });
});
