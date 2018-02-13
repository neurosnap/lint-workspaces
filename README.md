# lint-workspaces [![Build Status](https://travis-ci.org/neurosnap/lint-workspaces.svg?branch=master)](https://travis-ci.org/neurosnap/lint-workspaces)

Simple linter to keep internal dependencies up-to-date for yarn workspaces

## Motivation

Maintaining every package.json for all packages withing a workspace can be a burden.
What this package does:

* Creates missing package.json files
* Adds dependencies based on scoped import statements to package.json
* Removes dependencies from package.json that are no longer used in the package

## Use

### Create missing package.json files

```bash
lint-workspaces create --scope="@tester"
```

### Require package.json files in all packages

```bash
lint-workspaces require --scope="@tester"
```

### Check for missing dependendcies or remove dependencies inside package.json

```bash
lint-workspaces depend --scope="@tester"
```

To automatically fix the prolems:

```bash
lint-workspaces depends --scope="@tester" --fix
```

## Options

* `dir`: directory to use, defaults to "."
* `workspaces`: list of workspaces to look for packages e.g. "./src/packages"
* `scope`: npm scope for packages, e.g. "@lint-workspaces/packageA"
* `name`: name of package, e.g. "packageA"
* `version`: `package.version` to use when creating package.json file
* `template`: location of template file for package.json
* `force`: destructively destroys and rebuilds package.json for each package
* `fix`: fixes any dependencies issues

## Example of template package.json file

```json
{
  "name": "${scope}/${name}",
  "version": "${version}",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": 'echo "Error: no test specified" && exit 1'
  },
  "author": "Eric Bower",
  "license": "MIT",
  "dependencies": {}
}
```

scope, name, and version are required

