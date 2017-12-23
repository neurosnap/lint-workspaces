const path = require('path');

const { task } = require('../util');
const { checkDepends } = require('../check-pkg-dependencies');
const {
  DEPENDENCY_MISSING_IN_PACKAGE_JSON,
  UNNECESSARY_PACKAGE_DEPENDENCY,
} = require('../constants');

const fixture = path.join(__dirname, 'fixtures');

describe('checking that dependencies are inside package.json', () => {
  describe('when there is a dependency missing from package.json', () => {
    it('should return an error', () => {
      expect.assertions(2);
      const results = task(checkDepends, [fixture]);

      return results.then((actual) => {
        expect(actual.length).toEqual(2);
        const first = actual.find((err) => err.type === DEPENDENCY_MISSING_IN_PACKAGE_JSON);
        expect(first.importName).toEqual('@trove/thread');
      });
    });
  });

  describe('when there is an unnecessary dependency in a package.json', () => {
    it('should return an error', () => {
      expect.assertions(2);
      const results = task(checkDepends, [fixture]);

      return results.then((actual) => {
        expect(actual.length).toEqual(2);
        const first = actual.find((err) => err.type === UNNECESSARY_PACKAGE_DEPENDENCY);
        expect(first.importName).toEqual('@trove/something');
      });
    });
  });
});
