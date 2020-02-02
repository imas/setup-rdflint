# setup-rdflint
GitHub Action to setup [rdflint](https://github.com/imas/rdflint)

## Usage

```yml
runs-on: ubuntu-latest
steps:
  - uses: actions/checkout@v2
  - uses: actions/setup-java@v1
    with:
      java-version: 11
  - uses: imas/setup-rdflint@v1
  - run: rdflint -config rdflint-config.yml
```

## Inputs

- `rdflint-version`: Optional. The version of rdflint to be installed. Example: `0.1.2`. Defaults to `latest`.

## License

MIT License
