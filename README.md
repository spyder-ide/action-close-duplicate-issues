# Close Duplicate Issues - GitHub Actions

A GitHub action that closes dulicate issues with a given message and labels.

## Usage

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
               "labels": ["resolution:Duplicate"]
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
