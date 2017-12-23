const path = require('path');

const { task } = require('./util');
const { checkDepends } = require('./check-pkg-dependencies');
const {
  addDependencyToPackageJsonFiles,
  removeDependencyFromPackageJsonFiles,
} = require('./update-pkg-dependencies');
const {
  DEPENDENCY_MISSING_IN_PACKAGE_JSON,
  UNNECESSARY_PACKAGE_DEPENDENCY,
} = require('./constants');

const fixture = path.join(__dirname, '..', 'fixtures');

describe('update dependencies inside package.json', () => {
  describe('when there is a dependency missing from package.json', () => {
    it('should add package dependencies', () => {
      expect.assertions(1);
      const results = task(checkDepends, [fixture]);

      return results.then((res) => {
        const onlyDepeds = res.filter((r) => r.type === DEPENDENCY_MISSING_IN_PACKAGE_JSON);
        const actual = addDependencyToPackageJsonFiles(onlyDepeds, '1.0.0');
        const vals = Object.values(actual);

        expect(vals).toEqual([{
          dependencies: {
            '@trove/thread': '1.0.0',
          },
          name: 'test-pkg',
          version: '1.0.0',
        }]);
      });
    });
  });

  describe('when there is an unnecessary dependency in a package.json', () => {
    it('should remove the unnecessary dependency', () => {
      expect.assertions(1);
      const results = task(checkDepends, [fixture]);

      return results.then((res) => {
        const onlyDepeds = res.filter((r) => r.type === UNNECESSARY_PACKAGE_DEPENDENCY);
        const actual = removeDependencyFromPackageJsonFiles(onlyDepeds);
        const vals = Object.values(actual);

        expect(vals).toEqual([{
          dependencies: {
            '@trove/thread': '1.0.0',
          },
          name: 'test-pkg-trio',
          version: '1.0.0',
        }]);
      });
    });
  });
});
