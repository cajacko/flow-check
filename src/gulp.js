const gulp = require('gulp');
const license = require('gulp-header-license');
const gulpFilter = require('gulp-filter');

const header = '/* @flow */\n';
let fileCount = 0;
let flowCount = 0;

function filterOut(file) {
  if (!file) {
    return true;
  }

  if (!file.contents) {
    return true;
  }

  const contents = file.contents.toString('utf-8');

  if (!contents) {
    return true;
  }

  if (contents.includes('@flow')) {
    return false;
  }

  return true;
}

function filter(changing) {
  return gulpFilter((file) => {
    const filterFile = filterOut(file);
    fileCount += 1;

    const filePath = file.path.replace(process.cwd(), '');

    if (!filterFile) {
      flowCount += 1;
      return false;
    }

    if (changing) {
      console.log(`Changing: .${filePath}`);
    } else {
      console.log(`Does not contain @flow: .${filePath}`);
    }

    return true;
  });
}

function endLog(changing, done) {
  let finalFlowCount = flowCount;

  if (changing) {
    finalFlowCount = fileCount;
  }

  const coverage = Math.floor((finalFlowCount / fileCount) * 100);

  console.log('');
  console.log(`Flow coverage: ${coverage}% - ${finalFlowCount}/${fileCount} files`);

  const nonFlowCount = fileCount - finalFlowCount;

  if (done) {
    done(nonFlowCount);
  }
}


exports.check = function check(src, done) {
  fileCount = 0;
  flowCount = 0;

  return gulp.src(src)
    .pipe(filter(false))
    .pipe(gulp.dest('./')) // Needed otherwise .on('end') won't be called
    .on('end', () => endLog(false, done));
};

exports.change = function change(src, done) {
  fileCount = 0;
  flowCount = 0;

  return gulp.src(src, { base: process.cwd() })
    .pipe(filter(true))
    .pipe(license(header))
    .pipe(gulp.dest('./'))
    .on('end', () => endLog(true, done));
};
