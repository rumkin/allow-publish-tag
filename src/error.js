
class AptError extends Error {
  static code = ''

  constructor(detail = {}) {
    super('')
    this.name = this.constructor.name
    this.code = this.constructor.code
    this.message = this.constructor.message || this.format(detail)
    this.detail = detail
  }

  format() {
    throw new Error('Not implemented')
  }
}

class AptTypeError extends TypeError {
  static code = ''

  constructor(detail = {}) {
    super('')
    this.name = this.constructor.name
    this.code = this.constructor.code
    this.message = this.constructor.message || this.format(detail)
    this.detail = detail
  }

  format() {
    throw new Error('Not implemented')
  }
}

class PkgDirectiveTypeError extends AptTypeError {
  static code = 'ALLPUBTAG/PKG_DIRECTIVE_TYPE'
  static message = 'Package directive `allowPublishTag` is not an object.'
}

class PrereleaseTagError extends AptError {
  static code = 'ALLPUBTAG/PRERELEASE_TAG'
  format({tag, prerelease}) {
    return `Prerelease "${prerelease}" couldn't be published with tag "${tag}".`
  }
}

class ProductionTagError extends AptError {
  static code = 'ALLPUBTAG/PRODUCTION_TAG'
  format({tag}) {
    return `Production version should have "latest" tag. But "${tag}" is given.`
  }
}

exports.PkgDirectiveTypeError = PkgDirectiveTypeError
exports.PrereleaseTagError = PrereleaseTagError
exports.ProductionTagError = ProductionTagError
