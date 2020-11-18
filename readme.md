# Allow Publish Tag

Allow publish tag prevents your NPM package from being accidentally
published with `latest` dist-tag for prereleases, e.g. alpha, beta, etc. Instead it
enforces you to use proper dist-tag (`next` by default). It works with
`prepublishOnly` hook from `package.json`.

## Installation

```
npm i allow-publish-tag
```

## Usage

1. Add `prepublishOnly` script in `package.json`.
2. Run `npm publish` when you're ready to publish your package, or `npm publish --dry-run`.

Example `package.json`:
```js
{
  "version" : "1.0.0-alpha.1",
  "scripts": {
    "prepublishOnly": "allow-publish-tag"
  }
}
```

## Configuration

You can configure allow publish tag to use ccustom release scheme. For example use `nightly` and
`beta` prereleases, like Electron does:

```js
{
  "version" : "1.0.0-nightly.1",
  "scripts": {
    "prepublishOnly": "allow-publish-tag"
  },
  "allowPublishTags": {
    // Match all nightly or beta releases e.g "nightly", "beta.3", etc.
    "next": "{nightly,beta}?(.+([0-9]))"
  }
}
```

## API

### CLI

```text
allow-publish-tags [...TAGS]
```

* `[...TAGS]` – is a list of allowed dist-tags to be used with the current package version from `package.json`.

Using CLI with TAGS specified will allow to publish current version with any of provided dist-tags. If this
list is empty, then `allowPublishTag` field from `package.json` will be used as configuration. If there is
no `allowPublishTag` field, then the default configuration will be used.

### `AllowPublishTagRecord`


```text
AllowPublishTagFlag | AllowPublishTagList | AllowPublishTagDict
```

Configuration value `AllowPublishTagRecord` describes the value of `allowPublishVersion` field of `package.json`.

### `AllowPublishTagFlag`

```text
true
```

Boolean value `true` turns default APT configuration on.

Example:

```js
{
  "allowPublishVersion": true
}
```

### `AllowPublishTagList`

```text
Array<string>|string
```

Array should contain allowed prerelease names for the `next` dist-tag, which are strings or [picomatch](https://npmjs.com/package/picomatch)-compatible glob patterns.

Example:

```js
{
  "allowPublishVersion": ["alpha", "beta", "pre.*"]
}
```

### `AllowPublishTagDict`

```text
{
  [string]: Array<string>|string,
  '*': Array<string>|string,
}
```

Dictionary contains records where key is a dist-tag and value is a list of allowed prereleases. Prerelease name could be a string or a [picomatch](https://npmjs.com/package/picomatch)-compatible glob pattern. If there is the asterisk key, then
this rules will match all dist-tags.

Example:

```js
{
  "allowPublishVersion": {
    "next": "{alpha,beta,rc}?(.+([0-9]))"
  }
}
```

## License

MIT.
