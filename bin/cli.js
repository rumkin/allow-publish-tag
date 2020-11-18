#!/usr/bin/env node
const path = require('path')
const {check, checkDirective} = require('..')

main()
.then((code) => process.exit(code))

function main() {
  const DEBUG = process.env.DEBUG === '1'
  const pkg = require(path.join(process.cwd(), 'package.json'))

  return whilst(pkg, [
    execArgvCheck,
    execDirectiveCheck,
  ])
  .then((result) => {
    if (!result) {
      console.error('Specify allowed tags as cli arguments or with allowPublishTag directive in package.json.')

      return 1
    }

    return result.exitCode
  })
  .catch(err => {
    if ((err.code || '').startsWith('ALLPUBTAG/') && !DEBUG) {
      console.error(err.message)
    }
    else {
      console.error(err)
    }

    return 1
  })
}

function execArgvCheck(pkg) {
  const cliTags = process.argv.slice(2)
  const distTag = process.env.npm_config_tag

  if (!cliTags.length) {
    return
  }

  check(pkg, cliTags, distTag)

  return {exitCode: 0}
}

function execDirectiveCheck(pkg) {
  const distTag = process.env.npm_config_tag

  checkDirective(pkg, distTag)

  return {exitCode: 0}
}

async function whilst(context, fns) {
  for (const fn of fns) {
    const result = await fn(context)
    if (result) {
      return result
    }
  }
}
