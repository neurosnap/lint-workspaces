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

`dir`: directory to use, defaults to "."
`workspaces`: list of workspaces to look for packages e.g. "./src/packages"
`scope`: npm scope for packages, e.g. "@lint-workspaces/packageA"
`name`: name of package, e.g. "packageA"
`version`: `package.version` to use when creating package.json file
`template`: location of template file for package.json
`force`: destructively destroys and rebuilds package.json for each package
`fix`: fixes any dependencies issues

## Example of template package.json file

```json
{
  "name": "${scope}/${name}",                                                                                                                    │  express:router urlencodedParser  : /user/38f51d86-6780-4bda-9f38-c8eabf034c31 +0ms
  "version": "${version}",                                                                                                                       │  body-parser:urlencoded skip empty body +0ms
  "description": "",                                                                                                                             │  express:router jsonParser  : /user/38f51d86-6780-4bda-9f38-c8eabf034c31 +0ms
  "main": "index.js",                                                                                                                            │  body-parser:json skip empty body +0ms
  "scripts": {                                                                                                                                   │  express:router serveStatic  : /user/38f51d86-6780-4bda-9f38-c8eabf034c31 +0ms
    "test": 'echo "Error: no test specified" && exit 1'                                                                                          │  send stat "/Users/erock/dev/youhood/public/user/38f51d86-6780-4bda-9f38-c8eabf034c31" +0ms
  },                                                                                                                                             │  express:router router  : /user/38f51d86-6780-4bda-9f38-c8eabf034c31 +0ms
  "author": "Eric Bower",                                                                                                                        │  express:router dispatching GET /user/38f51d86-6780-4bda-9f38-c8eabf034c31 +0ms
  "license": "MIT",                                                                                                                              │  express:router trim prefix (/user) from url /user/38f51d86-6780-4bda-9f38-c8eabf034c31 +0ms
  "dependencies": {}                                                                                                                             │  express:router router /user : /user/38f51d86-6780-4bda-9f38-c8eabf034c31 +0ms
}
```

scope, name, and version are required

