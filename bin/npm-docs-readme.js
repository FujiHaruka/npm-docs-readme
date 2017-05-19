#!/usr/bin/env node
const commander = require('commander')
const thisPkg = require('../package.json')
const promisify = require('es6-promisify')
const pkgJson = require('pkg.json')
const pkgJsonAsync = promisify(pkgJson)
const co = require('co')
const marked = require('marked')
const TerminalRenderer = require('marked-terminal')

commander
  .version(thisPkg.version)
  .arguments('[repository]', 'Repository')
  .action(main)

commander
  .on('--help', () => {
    console.log(`
  Examples:

    $ npm-docs-readme npm-docs-readme
`)
  })

commander
  .parse(process.argv)

if (!process.argv.slice(2).length) {
  commander.outputHelp()
}

function main (repos) {
  return co(function * () {
    let pkg = yield pkgJsonAsync(repos)
    let { readme } = pkg
    marked.setOptions({
      renderer: new TerminalRenderer()
    })
    console.log(marked(readme))
  }).catch(e => {
    console.error(e.message)
  })
}
