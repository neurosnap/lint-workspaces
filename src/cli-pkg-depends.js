const lodash = require('lodash');
const { get } = lodash;
const debug = require('debug')('lint-workspaces');
const argv = require('minimist')(process.argv.slice(2));

const opkg = require('../package.json');

const { task, logPretty, error, verbose } = require('./util');
const { checkDepends } = require('./check-pkg-depends');
const {
  addDependencyToPackageJsonFiles,
  removeDependencyFromPackageJsonFiles,
  savePackageJsonFiles,
} = require('./update-pkg-depends');
const {
  UNNECESSARY_PACKAGE_DEPENDENCY,
  DEPENDENCY_MISSING_IN_PACKAGE_JSON,
} = require('./constants');

const VERSION = '1.0.0';
const shouldFix = !!argv.fix;
const scope = argv.scope;
let workspaces = argv.workspaces || opkg.workspaces || [];
if (typeof workspaces === 'string') {
  workspaces = workspaces.split(',');
}

verbose('Options passed to cli:\n' + JSON.stringify(argv, null, 2));

if (!scope) {
  throw new Error('scope argument is required, --scope="@tester"');
}

task(run, workspaces, { fix: shouldFix, version: VERSION, scope });

function* run(dirs, options) {
  const { fix, version, scope } = options;
  verbose(
    'Options passed to runner:\n' +
    JSON.stringify({ dirs, ...options }, null, 2),
  );
  logPretty(
    'Checking that all packages have included all ' + scope + ' dependencies inside their `package.json`\n' +
    'Also Checking that there are no unnecessary ' + scope + ' dependencies inside `package.json` ...',
  );
  const errors = yield task(checkDepends, dirs, options);

  if (errors.length === 0) {
    logPretty('All `pacakge.json` files have the required dependencies and nothing else!', 'green');
    return;
  }

  const dependsErrors = errors.filter(
    (err) => err.type === DEPENDENCY_MISSING_IN_PACKAGE_JSON,
  );
  const unnecessaryErrors = errors.filter(
    (err) => err.type === UNNECESSARY_PACKAGE_DEPENDENCY,
  );

  if (!fix) {
    errors.forEach((err) => debug(err));
    error(`Detected (${errors.length}) errors total`);

    if (dependsErrors.length > 0) {
      error(`Detected (${dependsErrors.length}) dependency issues relating to dependencies missing in package.json!`);
    }

    if (unnecessaryErrors.length > 0) {
      const pkgFiles = {};
      unnecessaryErrors.forEach((err) => {
        const key = err.pkg.file;
        if (!pkgFiles.hasOwnProperty(key)) pkgFiles[key] = 0;
        pkgFiles[key] += 1;
      });

      Object
        .keys(pkgFiles)
        .forEach(
          (pkgFile) => error(`${pkgFile} has (${pkgFiles[pkgFile]}) dependency issues`),
        );
    }

    error('\nRun again with DEBUG="lint-workspaces" to get more information');
    logPretty('Run `make pkg-depends-update` to automatically fix dependency issues.');
    process.exit(1);
  }

  const pkgJsonMap = {
    ...addDependencyToPackageJsonFiles(dependsErrors, version),
    ...removeDependencyFromPackageJsonFiles(unnecessaryErrors),
  };

  savePackageJsonFiles(pkgJsonMap);
}
