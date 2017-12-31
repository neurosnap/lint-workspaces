const path = require('path');
const {
  readdir,
  task,
  ensureDir,
  stat,
  cleanGlob,
  flatten,
  verbose,
  logPretty,
  error,
} = require('./util');

function* run(dirs) {
  logPretty('Checking that all packages have a `package.json` ...');

  const results = yield dirs.map((pkgFolder) => {
    const dir = cleanGlob(pkgFolder);
    return task(processDir, dir);
  });

  const errors = flatten(results)
    .filter(Boolean)
    .filter(getNotFoundErrors);

  if (errors.length > 0) {
    errors.forEach((err) => error(err));
    process.exit(1);
    return;
  }

  logPretty('All packages have `package.json`!', 'green');
}

function* processDir(dir) {
  verbose(`Inspecting ${dir} ...`);

  try {
    const files = yield readdir(dir);
    const values = yield files.map((file) => {
      const pkgDir = path.join(dir, file);
      const pkgJson = path.join(pkgDir, 'package.json');

      return ensureDir(pkgDir)
        .then(() => stat(pkgJson))
        .then(() => ({ type: 'Success', msg: `${pkgJson} found` }))
        .catch((err) => err);
    });

    return values;
  } catch (err) {
    error(err);
  }
}

function getNotFoundErrors(result) {
  return result.type === 'NotFound';
}

module.exports = run;
