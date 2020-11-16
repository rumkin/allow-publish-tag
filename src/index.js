const isPlainObject = require('lodash.isplainobject')
const semver = require('semver')

const {PrereleaseTagError, PkgDirectiveTypeError, ProductionTagError} = require('./error')

function checkTags(pkg, allowedTags, tag) {
  const {prerelease} = semver.parse(pkg.version)
  if (!prerelease.length) {
    return true
  }

  if (!allowedTags.includes(tag)) {
    throw new PrereleaseTagError({
      tag,
      prerelease,
    })
  }

  return true
}

function checkPkgTags(pkg, tag) {
  if (!isPlainObject(pkg.allowPublishTag)) {
    throw new PkgDirectiveTypeError()
  }

  const {prerelease: [prerelease]} = semver.parse(pkg.version)

  if (prerelease) {
    const allowedReleases = pkg.allowPublishTag[tag]
    if (!allowedReleases || !allowedReleases.includes(prerelease)) {
      throw new PrereleaseTagError({
        tag,
        prerelease,
      })
    }
  }
  else if (tag !== 'latest') {
    throw new ProductionTagError({tag: tag})
  }

  return true
}

exports.checkTags = checkTags
exports.checkPkgTags = checkPkgTags
