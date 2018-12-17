# Allow Publish Tags

Allow publish tag is preventing your NPM package from being accidentally
published with latest tag. Use it with `prepublishOnly` hook in your package
file.

How it works?

1. Add `prepublishOnly` hook in `package.json`.
2. Specify allowed tag list as cli arguments: `allow-publish-tags next dev`.

## Installation

```
npm i allow-publish-tags
```

## Usage

```javascript
// package.json
{
  "scripts": {
    "prepublishOnly": "allow-publish-tags next"
  }
}
```

## License

MIT.
