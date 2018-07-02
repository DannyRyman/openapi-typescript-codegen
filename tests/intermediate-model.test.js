const extractDefinitions = require('../lib/extract-definitions.js')

test('simple transform', () => {
  const input = {
    components: {
      schemas: {
        SampleDefinition: {
          required: ['prop1'],
          properties: {
            prop1: {
              type: 'string'
            }
          }
        }
      }
    }
  }

  const expected = {
    models: [{
      modelname: 'SampleDefinition',
      properties: [{
        propname: 'prop1',
        type: 'string',
        required: true
      }]
    }],
    enums: []
  }
  assertTransformation(input, expected)
})


test('transform definition with multiple properties', () => {
  const input = {
    components: {
      schemas: {
        SampleDefinition: {
          required: ['prop1', 'prop2'],
          properties: {
            prop1: {
              type: 'string'
            },
            prop2: {
              type: 'string'
            }
          }
        }
      }
    }
  }

  const expected = {
    models: [{
      modelname: 'SampleDefinition',
      properties: [{
        propname: 'prop1',
        type: 'string',
        required: true
      }, {
        propname: 'prop2',
        type: 'string',
        required: true
      }]
    }],
    enums: []
  }

  assertTransformation(input, expected)
})


test('non-required property', () => {
  const input = {
    components: {
      schemas: {
        SampleDefinition: {
          properties: {
            prop1: {
              type: 'string'
            }
          }
        }
      }
    }
  }

  const expected = {
    models: [{
      modelname: 'SampleDefinition',
      properties: [{
        propname: 'prop1',
        type: 'string'
      }]
    }],
    enums: []
  }
  assertTransformation(input, expected)
})

test('simple datatype mapping', () => {
  const input = {
    components: {
      schemas: {
        SampleDefinition: {
          properties: {
            integerProp: { type: 'integer' },
            numberProp: { type: 'number' },
            boolProp: { type: 'boolean' },
            dateProp: { type: 'string', format: 'date' },
            dateTimeProp: { type: 'string', format: 'date-time' },
            stringProp: { type: 'string' },
            objectProp: { type: 'object' }
          }
        }
      }
    }
  }

  const expected = {
    models: [{
      modelname: 'SampleDefinition',
      properties: [{
        propname: 'integerProp',
        type: 'number'
      }, {
        propname: 'numberProp',
        type: 'number'
      }, {
        propname: 'boolProp',
        type: 'boolean'
      }, {
        propname: 'dateProp',
        type: 'string'
      }, {
        propname: 'dateTimeProp',
        type: 'string'
      }, {
        propname: 'stringProp',
        type: 'string'
      }, {
        propname: 'objectProp',
        type: 'Object'
      }]
    }],
    enums: []
  }
  assertTransformation(input, expected)
})

test('referenced schema type mapping', () => {
  const input = {
    components: {
      schemas: {
        SampleDefinition: {
          properties: {
            complexProp: {
              $ref: '#/definitions/ComplexTypeDef'
            }
          }
        },
        ComplexTypeDef: {
          properties: {
            prop1: { type: 'string' },
            prop2: { type: 'boolean' }
          }
        }
      }
    }
  }

  const expected = {
    models: [{
      modelname: 'SampleDefinition',
      properties: [
        {
          propname: 'complexProp',
          type: 'ComplexTypeDef'
        }
      ]
    }, {
      modelname: 'ComplexTypeDef',
      properties: [
        {
          propname: 'prop1',
          type: 'string'
        },
        {
          propname: 'prop2',
          type: 'boolean'
        }
      ]
    }],
    enums: []
  }

  assertTransformation(input, expected)
})

test('simple array types', () => {
  const input = {
    components: {
      schemas: {
        SampleDefinition: {
          properties: {
            simpleArray: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        }
      }
    }
  }

  const expected = {
    models: [{
      modelname: 'SampleDefinition',
      properties: [{
        propname: 'simpleArray',
        type: 'string[]'
      }]
    }],
    enums: []
  }

  assertTransformation(input, expected)
})

test('complex array types', () => {
  const input = {
    components: {
      schemas: {
        SampleDefinition: {
          properties: {
            complexArray: {
              type: 'array',
              items: { $ref: '#/definitions/ComplexTypeDef' }
            }
          }
        },
        ComplexTypeDef: {
          properties: {
            prop1: { type: 'string' },
            prop2: { type: 'boolean' }
          }
        }
      }
    }
  }

  const expected = {
    models: [{
      modelname: 'SampleDefinition',
      properties: [{
        propname: 'complexArray',
        type: 'ComplexTypeDef[]'
      }]
    }, {
      modelname: 'ComplexTypeDef',
      properties: [{
        propname: 'prop1',
        type: 'string'
      }, {
        propname: 'prop2',
        type: 'boolean'
      }]
    }],
    enums: []
  }

  assertTransformation(input, expected)
})

test('enum as a reference', () => {
  const input = {
    components: {
      schemas: {
        SampleDefinition: {
          properties: {
            prop1: {
              $ref: '#/definitions/List'
            }
          }
        },
        List: {
          type: 'string',
          enum: ['loan', 'bond']
        }
      }
    }
  }

  const expected = {
    models: [{
      modelname: 'SampleDefinition',
      properties: [
        {
          propname: 'prop1',
          type: 'List'
        }
      ]
    }],
    enums: [{
      typeName: 'List',
      valueName: 'listValues',
      enums: [
        'loan',
        'bond'
      ]
    }]
  }

  assertTransformation(input, expected)
})

test('enums', () => {
  const input = {
    components: {
      schemas: {
        SampleDefinition: {
          properties: {
            prop1: {
              type: 'string',
              enum: ['loan', 'bond']
            }
          }
        }
      }
    }
  }

  const expected = {
    models: [{
      modelname: 'SampleDefinition',
      properties: [{
        propname: 'prop1',
        type: 'Prop1'
      }]
    }],
    enums: [{
      typeName: 'Prop1',
      valueName: 'prop1Values',
      enums: [
        'loan',
        'bond'
      ]
    }]
  }

  assertTransformation(input, expected)
})

test('enums with special characters are preserved', () => {
  const input = {
    components: {
      schemas: {
        SampleDefinition: {
          properties: {
            prop1: {
              type: 'string',
              enum: ['loan', 'cats & dogs', 'wh^^om$&8*@']
            }
          }
        }
      }
    }
  }

  const expected = {
    models: [
      {
        modelname: 'SampleDefinition',
        properties: [
          {
            propname: 'prop1',
            type: 'Prop1'
          }
        ]
      }
    ],
    enums: [
      {
        typeName: 'Prop1',
        valueName: 'prop1Values',
        enums: [
          'loan',
          'cats & dogs',
          'wh^^om$&8*@'
        ]
      }
    ]
  }

  assertTransformation(input, expected)
})

test('enum within array', () => {
  const input = {
    components: {
      schemas: {
        SampleDefinition: {
          properties: {
            prop1: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['loan', 'bond']
              }
            }
          }
        }
      }
    }
  }

  const expected = {
    models: [{
      modelname: 'SampleDefinition',
      properties: [
        {
          propname: 'prop1',
          type: 'Prop1[]'
        }
      ]
    }],
    enums: [{
      typeName: 'Prop1',
      valueName: 'prop1Values',
      enums: [
        'loan',
        'bond'
      ]
    }]
  }

  assertTransformation(input, expected)
})

test('convert kebab to camel case', () => {
  const input = {
    components: {
      schemas: {
        SampleDefinition: {
          properties: {
            'prop-type-string': {
              type: 'string',
              enum: ['loan', 'bond']
            }
          }
        }
      }
    }
  }

  const expected = {
    models: [{
      modelname: 'SampleDefinition',
      properties: [{
        propname: 'propTypeString',
        type: 'PropTypeString'
      }
      ]
    }
    ],
    enums: [{
      typeName: 'PropTypeString',
      valueName: 'propTypeStringValues',
      enums: [
        'loan',
        'bond'
      ]
    }]
  }

  assertTransformation(input, expected)
})

function assertTransformation(input, expected) {
  const output = extractDefinitions(input)
  expect(output).toEqual(expected)
}
