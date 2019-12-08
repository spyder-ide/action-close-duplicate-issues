# Close Duplicate Issues - GitHub Actions

A GitHub action that closes duplicate issues where a specific string is found, replies with a given defined message, and optionally adds labels and closes the issue.

## Usage

For an opened issue the items are checked in order and if a match is found the resto of items are not checked.

Order is important!

```
name: Close duplicate issues

on: [issues]

jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - uses: spyder-ide/actions-close-duplicate-issues@master
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          items: >-
            [
             {
               "string": "ValueError: cannot set WRITEABLE flag to True of this array",
               "reply": "To fix this problem please update to Spyder 4.<br><br>Closing as duplicate of Issue #1",
               "labels": ["resolution:Duplicate"],
               "close": true
             },
             {
               "string": "ValueError: Some other error",
               "reply": "To fix this problem please update to Spyder 4.",
               "labels": ["resolution:Duplicate"],
               "close": false
             }
            ]
```

## Contributing

### Build 

The build steps transpiles the `src/main.ts` to `lib/main.js` which is used in the Docker container. 
It is handled by Typescript compiler. 

```sh
$ npm run build
```
