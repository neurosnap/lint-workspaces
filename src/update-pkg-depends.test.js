const path = require('path');
const test = require('tape');

const { task } = require('./util');
const { checkDepends } = require('./check-pkg-depends');
const {
  addDependencyToPackageJsonFiles,
  removeDependencyFromPackageJsonFiles,
} = require('./update-pkg-depends');
const {
  DEPENDENCY_MISSING_IN_PACKAGE_JSON,
  UNNECESSARY_PACKAGE_DEPENDENCY,
} = require('./constants');

const fixture = path.join(__dirname, '..', 'fixtures');

test('when there is a dependency missing from package.json', (t) => {
  t.plan(1);
  const results = task(checkDepends, [fixture], { scope: '@tester' });

  results.then((res) => {
    const onlyDepeds = res.filter((r) => r.type === DEPENDENCY_MISSING_IN_PACKAGE_JSON);
    const actual = addDependencyToPackageJsonFiles(onlyDepeds, '1.0.0');
    const vals = Object.values(actual);

    t.deepEqual(vals, [{
      dependencies: {
        '@tester/thread': '1.0.0',
      },
      name: 'test-pkg',
      version: '1.0.0',
    }], 'should add package dependencies');
    t.end();
  }).catch(() => t.end());
});

test('when there is an unnecessary dependency in a package.json', (t) => {
  t.plan(1);
  const results = task(checkDepends, [fixture], { scope: '@tester' });

  results.then((res) => {
    const onlyDepeds = res.filter((r) => r.type === UNNECESSARY_PACKAGE_DEPENDENCY);
    const actual = removeDependencyFromPackageJsonFiles(onlyDepeds);
    const vals = Object.values(actual);

    t.deepEqual(vals, [{
      dependencies: {
        '@tester/thread': '1.0.0',
      },
      name: 'test-pkg-trio',
      version: '1.0.0',
    }], 'should remove the unnecessary dependency');
    t.end();
  }).catch(() => t.end());
});
