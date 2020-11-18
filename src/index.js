const isPlainObject = require('lodash.isplainobject')
const picomatch = require('picomatch')
const semver = require('semver')

const {PrereleaseTagError, PkgDirectiveTypeError, ProductionTagError} = require('./error')

const defaultOptions = {
  next: ['{alpha,beta,rc}?(.+([0-9]))'],
}

function check(pkg, allowedTags, tag) {
  return checkWithOptions(pkg, tagsToMap(allowedTags), tag)
}

function checkWithOptions(pkg, options, tag) {
  const prerelease = getPrerelease(pkg.version)

  if (prerelease) {
    const allowedRules = getRules(options, tag)

    for (const allowedRule of allowedRules) {
      const matcher = picomatch(allowedRule)
      if (matcher(prerelease)) {
        return true
      }
    }

    throw new PrereleaseTagError({
      tag,
      prerelease,
    })
  }
  else if (tag !== 'latest') {
    throw new ProductionTagError({tag: tag})
  }

  return true
}

function checkDirective(pkg, tag) {
  let options
  const pkgOptions = 'allowPublishTag' in pkg ? pkg.allowPublishTag : true
  if (pkgOptions === true) {
    options = defaultOptions
  }
  else if (Array.isArray(pkgOptions)) {
    options = {
      next: pkgOptions,
    }
  }
  else if (isPlainObject(pkgOptions)) {
    options = pkgOptions
  }
  else {
    throw new PkgDirectiveTypeError()
  }

  return checkWithOptions(pkg, options, tag)
}

function tagsToMap(tags) {
  return Object.fromEntries(
    tags.map((tag) => [tag, ['*']]),
  )
}

function getRules(options, tag) {
  const rules = options[tag] || options['*'] || []

  if (typeof rules === 'string') {
    return [rules]
  }
  else {
    return rules
  }
}

function getPrerelease(version) {
  const parsed = semver.parse(version)
  if (parsed && parsed.prerelease.length) {
    return parsed.prerelease.join('.')
  }
  else {
    return null
  }
}

exports.check = check
exports.checkDirective = checkDirective
