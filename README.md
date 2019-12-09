# Close Duplicate Issues - GitHub Actions

A GitHub action that closes duplicate issues where a specific regex pattern is found, replies with a given defined message, optionally adds labels and optionally closes the issue.

## Usage

For an opened issue the items are checked in order and if a match is found the resto of the items are not checked.

Order is important!

Since actions do not support passing arrays as input parameters, we pass a JSON string for the items parameter.

```yaml
name: Close duplicate issues

on: [issues]

jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - uses: spyder-ide/action-close-duplicate-issues@master
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          items: >-
            [
             {
               "pattern": "ValueError: cannot set WRITEABLE flag to True of this array",
               "reply": "To fix this problem please update to Spyder 4.<br><br>Closing as duplicate of Issue #1",
               "labels": ["resolution:Duplicate"],
               "close": true
             },
             {
               "pattern": "ValueError: Some other error",
               "reply": "To fix this problem please update to Spyder 4.",
               "labels": ["resolution:Duplicate"],
               "close": false
             }
            ]
```

## Contributing

### Build 

The build steps transpiles the `src/main.ts` to `lib/main.js` and then packs to `dist/index.js`.
It is handled by Typescript compiler. 

Install NodeJS 12.

```sh
$ npm run install
$ npm i -g @zeit/ncc

$ npm run build
$ npm run format
$ npm run pack
```
