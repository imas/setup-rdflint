# setup-rdflint

GitHub Action to setup [rdflint](https://github.com/imas/rdflint)

## Usage

```yml
steps:
  - uses: actions/checkout@v6
  - uses: actions/setup-java@v5
    with:
      distribution: temurin
      java-version: 21
  - uses: imas/setup-rdflint@v4
    with:
      # The version of rdflint to be installed
      # Specify the exact version or `latest`
      # Default: latest
      rdflint-version: latest
  - run: rdflint -config rdflint-config.yml
```

## License

MIT License
