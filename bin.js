#!/usr/bin/env node

const isAllowedTags = require('./index.js');

const allowedTags = process.argv.slice(2);

if (allowedTags.length) {
  const currentTag = process.env.npm_config_tag;
  const version = process.env.npm_package_version;

  if (! isAllowedTags(version, allowedTags, currentTag)) {
    console.error('Package version %s requires one of provided publish tag: %s', version, allowedTags.join(', '));
    process.exit(1);
  }
}
