# Allow Publish Tag

Allow publish tag prevents your NPM package from being accidentally
published with `latest` tag for alpha, beta, etc versions. Use it with
`prepublishOnly` hook in your package file.

How it works?

1. Script searches release flag in the version of the publishing package.
2. If there is no release flag, script exits with code 0. If not, script
  continues execution.
3. Script watches if there is the tag provided with `npm publish` command, which
   is in allowed list. If tag is not in the list script exists with code 1 what
   interrupts publishing process.

## Installation

```
npm i allow-publish-tag
```

## Usage

1. Add `prepublishOnly` script in `package.json`.
2. Specify allowed tag list as cli arguments: `allow-publish-tag [..TAGS]` or into `package.json` directive `allowPublishTags`.
3. Run `npm publish --tag next` when you're ready to publish your package.

Example:
```js
// package.json
{
  "version" : "1.0.0-alpha.1",
  "scripts": {
    "prepublishOnly": "allow-publish-tag next"
  },
  "allowPublishTags": {
    "next": ["beta", "alpha", "rc"]
  }
}
```

## License

MIT.
