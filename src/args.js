const args = process.argv;
let shouldSkipCheck = false;

const skipArg = '--skip-check';
const index = args.indexOf(skipArg);

if (index > -1) {
  args.splice(index, 1);
  shouldSkipCheck = true;
}

exports.shouldSkipCheck = function skipCheck() {
  return shouldSkipCheck;
};

exports.getFlowArgs = function getFlowArgs() {
  args.splice(0, 2);
  return args;
};
