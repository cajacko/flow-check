const spawn = require('child_process').spawnSync;
const path = require('path');
const getFlowArgs = require('./args').getFlowArgs;

module.exports = function flow() {
  let args = [path.join(__dirname, '../node_modules/flow-bin/cli.js')];
  args = args.concat(getFlowArgs());

  return spawn('node', args, { cwd: process.cwd(), stdio: 'inherit' });
};
