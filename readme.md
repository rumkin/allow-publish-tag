# Allow Publish Tags

Allow publish tag is preventing your NPM package from being accidentally
published with latest tag. Use it with `prepublishOnly` hook in your package
file.

How it works?

1. Add `prepublishOnly` hook in `package.json`.
2. Specify allowed tag list as cli arguments: `allow-publish-tag next dev`.

## Installation

```
npm i allow-publish-tag
```

## Usage

```javascript
// package.json
{
  "scripts": {
    "prepublishOnly": "allow-publish-tag next"
  }
}
```

## License

MIT.
