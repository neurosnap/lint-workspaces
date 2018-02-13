#! /usr/bin/env node
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const { task, verbose, cleanGlob } = require('./src/util');
const cliPkgDepends = require('./src/cli-pkg-depends');
const requirePkg = require('./src/require-pkg');
const createPkg = require('./src/create-pkg');

const command = argv._[0];
const fix = !!argv.fix;
const force = !!argv.force;
const version = argv.version || '1.0.0';
const scope = argv.scope;
const template = argv.template;

const _dir = path.resolve(argv.dir);
const pkgDir = path.resolve(_dir, 'package.json');
const opkg = require(pkgDir);

let workspaces = argv.workspaces || opkg.workspaces || [];
if (typeof workspaces === 'string') {
  workspaces = workspaces.split(',');
}
workspaces = workspaces
  .map((workspace) => path.join(_dir, workspace))
  .map((workspace) => cleanGlob(workspace));

verbose('Options passed to cli:\n' + JSON.stringify(argv, null, 2));

if (command === 'depend') {
  if (!scope) {
    throw new Error('scope argument is required, --scope="@tester"');
  }

  task(cliPkgDepends, workspaces, { fix, version, scope });
} else if (command === 'require') {
  task(requirePkg, workspaces);
} else if (command === 'create') {
  workspaces.forEach((pkgFolder) => {
    task(createPkg, pkgFolder, { scope, template, version, force });
  });
}
