const spawn = require('child_process').spawnSync;
const path = require('path');
const getFlowArgs = require('./args').getFlowArgs;
var fs = require('fs');

module.exports = function flow() {
  let cliPath = path.join(__dirname, '../node_modules/flow-bin/cli.js');

  if (!fs.existsSync(path)) {
    cliPath = path.join(__dirname, '../../flow-bin/cli.js');
  }

  let args = [cliPath];
  args = args.concat(getFlowArgs());

  const response = spawn('node', args, { cwd: process.cwd(), stdio: 'inherit' });

  if (response.status !== 0) {
    throw new Error('FLOW ERROR, SEE ABOVE FOR LOG');
  }

  return response;
};
