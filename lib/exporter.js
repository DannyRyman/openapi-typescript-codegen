const codeGen = require('./code-gen')
const fs = require('fs')
const docLoader = require('./doc-loader.js')
const pathLib = require('path')

function exporter({ path, out, configs, templates, template }) {
  console.log('Attempting to generate the type definitions...')
  const doc = docLoader(path)

  // todo make sync
  const files = fs.readdirSync(configs)
  console.log('files', files)

  const configFileName = files.find(file => {
    return file === `${template}.json`
  })

  if (configFileName) {
    const configFileContents = fs.readFileSync(pathLib.join(configs, configFileName), 'UTF-8')
    const config = JSON.parse(configFileContents)
    console.log('config: ', config)
    config.transformations && config.transformations.forEach(transform => {
      const templatePath = pathLib.join(templates, config.language, transform.input)
      const templateContents = fs.readFileSync(templatePath, 'UTF-8')
      const outputContents = codeGen(doc, templateContents)
      const outputDirForTemplate = pathLib.join(out, template)
      if (!fs.exists(outputDirForTemplate)) {
        fs.mkdirSync(outputDirForTemplate)
      }
      const outputPath = pathLib.join(outputDirForTemplate, transform.output)
      fs.writeFileSync(outputPath, outputContents, 'utf8')
    })
    console.log('Successfully generated type defintions.')
  } else {
    console.log('Unable to find matching template')
  }
}

module.exports = exporter

