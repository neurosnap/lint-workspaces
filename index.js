const argv = require('minimist')(process.argv.slice(2));

const opkg = require('./package.json');
const { task, verbose } = require('./src/util');
const cliPkgDepends = require('./src/cli-pkg-depends');
const requirePkg = require('./src/require-pkg');
const createPkg = require('./src/create-pkg');

const command = argv._[0];
const fix = !!argv.fix;
const version = argv.version || '1.0.0';
const scope = argv.scope;
let workspaces = argv.workspaces || opkg.workspaces || [];
if (typeof workspaces === 'string') {
  workspaces = workspaces.split(',');
}

verbose('Options passed to cli:\n' + JSON.stringify(argv, null, 2));

if (command === 'depend') {
  if (!scope) {
    throw new Error('scope argument is required, --scope="@tester"');
  }

  task(cliPkgDepends, workspaces, { fix, version, scope });
} else if (command === 'require-pkg') {
  task(requirePkg, workspaces);
} else if (command === 'create-pkg') {
  workspaces.forEach((pkgFolder) => {
    task(createPkg, pkgFolder, { scope });
  });
}
