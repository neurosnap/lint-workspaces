/*
 * When executed this script create `package.json` files for any packages under `src/packages`
 * that have not been created yet.
 */
const path = require('path');
const { readdir, revStat, task, write, ensureDir, log, error } = require('./util');

const pkgFolder = './src/packages';

task(run, pkgFolder);

function* run(dir) {
  try {
    const files = yield readdir(dir);
    files.forEach((file) => {
      const pkgDir = path.join(dir, file);
      const pkgJson = path.join(pkgDir, 'package.json');

      ensureDir(pkgDir)
        .then(() => {
          task(createPkgJsonFile, pkgJson, file);
        })
        .catch(error);
    });
  } catch (err) {
    error(err);
  }
}

function* createPkgJsonFile(pkgJson, name) {
  try {
    yield revStat(pkgJson);
    const res = yield write(pkgJson, createPkgJsonContent(name));
    log(res);
  } catch (err) {
    error(err);
  }
}

function createPkgJsonContent(name) {
  const json = {
    name: `@trove/${name}`,
    version: '1.0.0',
    description: '',
    main: 'index.js',
    scripts: {
      test: 'echo "Error: no test specified" && exit 1',
    },
    author: '',
    license: 'MIT',
    dependencies: {},
  };

  return JSON.stringify(json, null, 2);
}
