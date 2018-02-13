/*
 * When executed this script create `package.json` files for any packages under `pkg.workspaces`
 * that have not been created yet.
 */
const path = require('path');
const { read, readdir, revStat, task, write, ensureDir, log, error } = require('./util');

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
  const version = options.version || '1.0.0';
  const template = options.template;
  const force = options.force || false;

  let pkgContent;
  if (template) {
    pkgContent = yield task(createPkgFileFromTemplate, {
      template,
      scope,
      name,
      version,
    });
  } else {
    pkgContent = createPkgFileFn({ scope, name, version });
  }

  try {
    yield revStat(pkgJson, force);
    const res = yield write(pkgJson, pkgContent);
    log(res);
  } catch (err) {
    error(err);
  }
}

function* createPkgFileFromTemplate({ template, scope, name, version }) {
  let data;
  try {
    data = yield read(template);
  } catch (err) {
    error(err);
    return;
  }

  return data.toString()
    .replace('${scope}', scope)
    .replace('${name}', name)
    .replace('${version}', version);
}

function createPkgJsonContent({ scope, name, version }) {
  const json = {
    name: `${scope}/${name}`,
    version: `${version}`,
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

module.exports = run;
