const handlebars = require('handlebars')
const extractDefinitions = require('./extract-definitions.js')
const path = require('path')
const fs = require('fs')

function codeGen (doc, template) {
  const definitions = extractDefinitions(doc)
  const compiledTemplate = handlebars.compile(template)
  return compiledTemplate(definitions)
}

module.exports = codeGen
