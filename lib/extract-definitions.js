/*
Converts swagger definitions to the following format:

{
  models: [{
    classname: 'HelloWorldResponse',
    properties: [{
      propname: 'message',
      type: 'string',
      required: true
    }, {
      propname: 'prop2',
      type: 'boolean',
      required: false
    }]
  }],
  enums: [{
    typeName: 'PetType',
    valueName: 'petTypeValues',
    enums: [
      'Dog',
      'Cat'
    ]
  }]
}
*/

function extractDefinitions (doc) {
  const extract = {
    models: mapModels(doc.components.schemas),
    enums: mapEnums(doc.components.schemas)
  }

  return extract
}

function mapModels (definitions) {
  const models = Object.keys(definitions)
  return models.map(modelName => mapModel(modelName, definitions)).filter(x => x !== undefined)
}

function mapEnums (definitions) {
  const defs = Object.keys(definitions)
  return flatMap(defName => mapEnumsForDef(defName, definitions[defName]), defs)
}

function flatMap (lambda, obj) {
  return obj.concat.apply([], obj.map(lambda))
}

function mapEnumsForDef (defName, definition) {
  if (definition.enum) {
    return createEnumDef(defName, definition.enum)
  }
  const props = Object.keys(definition.properties)
  return props.map(propName => mapEnumsForProperty(propName, definition.properties[propName]))
    .filter(x => x !== undefined)
}

function mapEnumsForProperty (propName, property) {
  if (property.enum) {
    return createEnumDef(propName, property.enum)
  } else if (property.type === 'array') {
    return mapEnumsForProperty(propName, property.items)
  }
}

const createEnumDef = (enumName, enums) => ({
  typeName: kebabToPascal(enumName),
  valueName: kebabToCamel(enumName) + 'Values',
  enums: enums
})

function mapModel (modelname, definitions) {
  const definition = definitions[modelname]
  if (definition.properties) {
    return {
      modelname,
      properties: mapProperties(definition, definitions)
    }
  }
}

function mapProperties (definition, definitions) {
  if (!definition.properties) return
  const props = Object.keys(definition.properties)
  return props.map(prop => mapProperty(prop, definition, definitions))
}

function mapProperty (prop, definition, definitions) {
  return {
    propname: kebabToCamel(prop),
    type: mapType(prop, definition.properties[prop], definitions),
    required: definition.required && definition.required.includes(prop)
  }
}

function mapType (propName, prop, definitions) {
  if (prop.$ref) {
    return getReferenceName(prop.$ref, definitions)
  } else if (prop.enum) {
    return getEnumName(propName)
  } else if (prop.type === 'array') {
    return mapType(propName, prop.items, definitions) + '[]'
  }
  return mapSimpleType(prop)
}

function getEnumName (refName) {
  return kebabToPascal(refName)
}

function getReferenceName (ref, definitions) {
  function getNameFromRefPath (ref) {
    return ref.substring(ref.lastIndexOf('/') + 1, ref.length)
  }

  if (ref) {
    // currently only supports single level definitions
    const refName = getNameFromRefPath(ref)
    const definition = definitions[refName]

    if (definition.enum) {
      return getEnumName(refName)
    } else {
      return refName
    }
  }
}

function mapSimpleType (prop) {
  if (prop.type === 'integer') {
    return 'number'
  } else if (['boolean', 'string', 'number'].includes(prop.type)) {
    return prop.type
  } else if (prop.type === 'object') {
    return 'Object'
  }
  throw new Error('Invalid property type')
}

function kebabToCamel (s) {
  const str = s.replace(/(\-\w)/g, function (m) { return m[1].toUpperCase() })
  return str.charAt(0).toLowerCase() + str.slice(1)
}

function kebabToPascal (s) {
  const str = kebabToCamel(s)
  return str.charAt(0).toUpperCase() + str.slice(1)
}

module.exports = extractDefinitions
