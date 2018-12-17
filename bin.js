#!/usr/bin/env node

const isAllowedTags = require('./index.js');

const allowedTags = process.argv.slice(2);

if (allowedTags.length) {
  const tag = process.env.npm_config_tag;

  if (! isAllowedTags(allowedTags, tag)) {
    console.error('Allowed publish tags are: %s', allowedTags.join(', '));
    process.exit(1);
  }
}
