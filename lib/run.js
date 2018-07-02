const exporter = require('./exporter')
const args = require('args')

args
  .option('path', 'The path to the swagger file (supports yaml or json)', 'swagger.json')
  .option('out', 'The path to output the type definitions', 'typedefs.ts')

const flags = args.parse(process.argv)

exporter(flags)
