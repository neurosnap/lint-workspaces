# lint-workspaces

Simple linter to keep internal dependencies up-to-date for yarn workspaces

## Motivation

Maintaining every package.json for all packages withing a workspace can be a burden.
What this package does:

* Creates missing package.json files
* Adds dependencies based on scoped import statements to package.json
* Removes dependencies from package.json that are no longer used in the package

## Use

```bash
./src/cli-pkg-depends.js --scope="@tester"
```

To automatically fix the prolems:

```bash
./src/cli-pkg-depends.js --scope="@tester" --fix
```
