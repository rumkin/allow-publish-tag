const assert = require('assert')
const path = require('path')
const {spawnSync} = require('child_process')

const {check, checkDirective} = require('..')

assert.ok(check({version: '1.0.0'}, ['next'], 'latest'), 'Version has no flag. No tag provided')
assert.ok(check({version: '1.0.0-beta'}, ['next'], 'next'), 'Version has no flag. Provided tag not allowed')
assert.ok(check({version: '1.0.0-alpha'}, ['next'], 'next'), 'Version has flag. Provided tag is allowed')
assert.throws(() => check({version: '1.0.0-alpha'}, ['next'], ''), {
  name: 'PrereleaseTagError',
}, 'Version has flag. No tag provided')
assert.throws(() => check({version: '1.0.0-alpha'}, ['next'], 'beta'), {
  name: 'PrereleaseTagError',
}, 'Version has flag. Provided tag is not allowed')

assert.ok(checkDirective({
  version: '1.0.0-beta.0',
  allowPublishTag: {
    next: ['{alpha,beta,rc}?(.+([0-9]))'],
  },
}, 'next'), 'Allow release "beta" with dist-tag "next"')

assert.ok(checkDirective({
  version: '1.0.0-beta.0',
  allowPublishTag: {
    next: '{alpha,beta,rc}?(.+([0-9]))',
  },
}, 'next'), 'Allow release "beta" with dist-tag "next"')

assert.ok(checkDirective({
  version: '1.0.0-pre.beta.0',
  allowPublishTag: {
    next: ['pre.*'],
  },
}, 'next'), 'Allow release "pre.beta" with dist-tag "next" and pattern "pre.*"')

assert.throws(() => checkDirective({
  version: '1.0.0-beta.0',
  allowPublishTag: null,
}, 'next'), {
  code: 'ALLPUBTAG/PKG_DIRECTIVE_TYPE',
  name: 'PkgDirectiveTypeError',
}, 'Thows PkgDirectiveTypeError if package.json#allowPublishTag is not a plain object')

assert.throws(() => checkDirective({
  version: '1.0.0-gamma',
  allowPublishTag: {
    next: ['beta', 'alpha', 'rc'],
  },
}, 'next'), {
  code: 'ALLPUBTAG/PRERELEASE_TAG',
  name: 'PrereleaseTagError',
}, 'Thows PrereleaseTagError when tag does not allow prerelease')

assert.throws(() => checkDirective({
  version: '1.0.0-gamma',
  allowPublishTag: {
    next: ['pre.*'],
  },
}, 'next'), {
  code: 'ALLPUBTAG/PRERELEASE_TAG',
  name: 'PrereleaseTagError',
}, 'Thows PrereleaseTagError with prerelease "gamma" and prerelease pattern "pre.*"')

assert.throws(() => checkDirective({
  version: '1.0.0',
  allowPublishTag: {
    next: ['beta', 'alpha', 'rc'],
  },
}, 'beta'), {
  code: 'ALLPUBTAG/PRODUCTION_TAG',
  name: 'ProductionTagError',
}, 'Allow release "beta" with dist-tag "next"')

assertMatch(runBin('fixtures/beta', 'next'), {
  stderr: '',
  status: 0,
}, 'Binary exits with 0 with `1.0.0-beta.1` version and `next` tag')

assertMatch(runBin('fixtures/beta', 'latest'), {
  status: 1,
}, 'Binary exits with 1 with `1.0.0-beta.1` version and `latest` tag')

assertMatch(runBin('fixtures/release', 'next'), {
  status: 1,
}, 'Binary exits with 1 with `1.0.0` version and `next` tag')

assertMatch(runBin('fixtures/empty-options', 'next'), {
  status: 0,
}, 'Binary exits with 0 with `1.0.0-beta.1` version and `next` tag')

assertMatch(runBin('fixtures/empty-options', 'latest'), {
  status: 1,
}, 'Binary exits with 1 with `1.0.0-beta.1` version and `latest` tag')

function runBin(dir, tag) {
  const result = spawnSync('node', [path.join(__dirname, '../bin/cli.js')], {
    cwd: path.join(__dirname, dir),
    env: {
      ...process.env,
      'npm_config_tag': tag,
    },
  })

  return {
    ...result,
    stdout: result.stdout ? result.stdout.toString('utf8') : '',
    stderr: result.stderr ? result.stderr.toString('utf8') : '',
  }
}

function assertMatch(a, b, message) {
  for (const [key, value] of Object.entries(b)) {
    assert.strictEqual(a[key], value, `Key "${key}": ${message}`)
  }
}
