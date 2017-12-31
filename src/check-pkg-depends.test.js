const path = require('path');
const test = require('tape');

const { task } = require('./util');
const { checkDepends } = require('./check-pkg-depends');
const {
  DEPENDENCY_MISSING_IN_PACKAGE_JSON,
  UNNECESSARY_PACKAGE_DEPENDENCY,
} = require('./constants');

const fixture = path.join(__dirname, '..', 'fixtures');

test('when there is a dependency missing from package.json', (t) => {
  t.plan(2);
  const results = task(checkDepends, [fixture], { scope: '@tester' });

  results.then((actual) => {
    t.equal(actual.length, 2);
    const first = actual.find(
      (err) => err.type === DEPENDENCY_MISSING_IN_PACKAGE_JSON
    );
    t.equal(first.importName, '@tester/thread', 'should return an error');
    t.end();
  }).catch(() => t.end());
});

test('when there is an unnecessary dependency in a package.json', (t) => {
  t.plan(2);
  const results = task(checkDepends, [fixture], { scope: '@tester' });

  results.then((actual) => {
    t.equal(actual.length, 2);
    const first = actual.find(
      (err) => err.type === UNNECESSARY_PACKAGE_DEPENDENCY
    );
    t.equal(first.importName, '@tester/something', 'should return an error');
    t.end();
  }).catch(() => t.end());
});
