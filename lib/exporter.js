const codeGen = require('./code-gen')
const fs = require('fs')
const docLoader = require('./doc-loader.js')

function exporter({ path, out }) {
  console.log('Attempting to generate the type definitions...')
  const doc = docLoader(path)
  const output = codeGen(doc)
  fs.writeFileSync(out, output, 'utf8')
  console.log('Successfully generated type defintions.')
}

module.exports = exporter

