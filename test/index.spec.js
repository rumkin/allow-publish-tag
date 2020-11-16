const assert = require('assert')
const path = require('path')
const {spawnSync} = require('child_process')

const {checkTags, checkPkgTags} = require('..')

assert.ok(checkTags({version: '1.0.0'}, ['next'], ''), 'Version has no flag. No tag provided')
assert.ok(checkTags({version: '1.0.0'}, ['next'], 'beta'), 'Version has no flag. Provided tag not allowed')
assert.ok(checkTags({version: '1.0.0-alpha'}, ['next'], 'next'), 'Version has flag. Provided tag is allowed')
assert.throws(() => checkTags({version: '1.0.0-alpha'}, ['next'], ''), {
  name: 'PrereleaseTagError',
}, 'Version has flag. No tag provided')
assert.throws(() => checkTags({version: '1.0.0-alpha'}, ['next'], 'beta'), {
  name: 'PrereleaseTagError',
}, 'Version has flag. Provided tag is not allowed')

assert.ok(checkPkgTags({
  version: '1.0.0-beta.0',
  allowPublishTag: {
    next: ['beta', 'alpha', 'rc'],
  },
}, 'next'), 'Allow release "beta" with dist-tag "next"')

assert.throws(() => checkPkgTags({
  version: '1.0.0-beta.0',
  allowPublishTag: null,
}, 'next'), {
  code: 'ALLPUBTAG/PKG_DIRECTIVE_TYPE',
  name: 'PkgDirectiveTypeError',
}, 'Thows PkgDirectiveTypeError if package.json#allowPublishTag is not a plain object')

assert.throws(() => checkPkgTags({
  version: '1.0.0-gamma',
  allowPublishTag: {
    next: ['beta', 'alpha', 'rc'],
  },
}, 'next'), {
  code: 'ALLPUBTAG/PRERELEASE_TAG',
  name: 'PrereleaseTagError',
}, 'Thows PrereleaseTagError when tag does not allow prerelease')

assert.throws(() => checkPkgTags({
  version: '1.0.0',
  allowPublishTag: {
    next: ['beta', 'alpha', 'rc'],
  },
}, 'beta'), {
  code: 'ALLPUBTAG/PRODUCTION_TAG',
  name: 'ProductionTagError',
}, 'Allow release "beta" with dist-tag "next"')

assertMatch(runBin('fixtures/beta', '1.0.0-beta.1', 'next'), {
  stderr: '',
  status: 0,
}, 'Binary exits with 0 with `1.0.0-beta.1` version and `next` tag')

assertMatch(runBin('fixtures/beta', '1.0.0-beta.1', 'latest'), {
  status: 1,
}, 'Binary exits with 1 with `1.0.0-beta.1` version and `latest` tag')

assertMatch(runBin('fixtures/release', '1.0.0', 'next'), {
  status: 1,
}, 'Binary exits with 1 with `1.0.0` version and `next` tag')

function runBin(dir, version, tag) {
  const result = spawnSync('node', [path.join(__dirname, '../bin/cli.js')], {
    cwd: path.join(__dirname, dir),
    env: {
      ...process.env,
      'npm_config_tag': tag,
      'npm_package_version': version,
    },
  })

  return {
    ...result,
    stdout: result.stdout ? result.stdout.toString('utf8') : '',
    stderr: result.stderr ? result.stdout.toString('utf8') : '',
  }
}

function assertMatch(a, b, message) {
  for (const [key, value] of Object.entries(b)) {
    assert.strictEqual(a[key], value, `Key "${key}": ${message}`)
  }
}
