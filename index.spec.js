const assert = require('assert');

const isAllowed = require('.');

assert.ok(isAllowed('1.0.0', ['next'], ''),  'Version has no flag. No tag provided');
assert.ok(isAllowed('1.0.0', ['next'], 'beta'),  'Version has no flag. Provided tag not allowed');
assert.ok(! isAllowed('1.0.0-alpha', ['next'], ''), 'Version has flag. No tag provided');
assert.ok(isAllowed('1.0.0-alpha', ['next'], 'next'), 'Version has flag. Provided tag is allowed');
assert.ok(! isAllowed('1.0.0-alpha', ['next'], 'beta'), 'Version has flag. Provided tag is not allowed');
