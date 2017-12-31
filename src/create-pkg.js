/*
 * When executed this script create `package.json` files for any packages under `pkg.workspaces`
 * that have not been created yet.
 */
const path = require('path');
const { readdir, revStat, task, write, ensureDir, log, error } = require('./util');

const opkg = require('../package.json');
const workspaces = opkg.workspaces;
const scope = '@tester';

workspaces.forEach((pkgFolder) => {
  task(run, pkgFolder, { scope });
});

function* run(dir, options) {
  try {
    const files = yield readdir(dir);
    files.forEach((file) => {
      const pkgDir = path.join(dir, file);
      const pkgJson = path.join(pkgDir, 'package.json');

      ensureDir(pkgDir)
        .then(() => {
          task(createPkgJsonFile, pkgJson, file, options);
        })
        .catch(error);
    });
  } catch (err) {
    error(err);
  }
}

function* createPkgJsonFile(pkgJson, name, options) {
  const createPkgFileFn = options.createPkgFileFn || createPkgJsonContent;
  const scope = options.scope || '';

  try {
    yield revStat(pkgJson);
    const res = yield write(pkgJson, createPkgFileFn(scope, name));
    log(res);
  } catch (err) {
    error(err);
  }
}

function createPkgJsonContent(scope, name) {
  const json = {
    name: `${scope}/${name}`,
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
