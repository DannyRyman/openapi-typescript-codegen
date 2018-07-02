const handlebars = require('handlebars')
const extractDefinitions = require('./extract-definitions.js')

function codeGen (doc) {
  const definitions = extractDefinitions(doc)

  console.log('definitions', JSON.stringify(definitions, null, 2))

  const templateSource = `
{{#enums}}
export type {{typeName}} =
{{#enums}}
  {{#if @index}}| {{/if}}'{{{this}}}'
{{/enums}}

export const {{valueName}}: {{typeName}}[] = [
{{#enums}}
  '{{{this}}}'{{#unless @last}},{{/unless}}
{{/enums}}
]
{{/enums}}{{#if enums.length}}
{{/if}}
{{#models}}
export interface {{modelname}} {
  {{#properties}}
  {{propname}}{{#unless required}}?{{/unless}}: {{type}}
  {{/properties}}
}

{{/models}}
`
  const template = handlebars.compile(templateSource)

  return template(definitions)
}

module.exports = codeGen
