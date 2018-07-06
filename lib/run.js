const exporter = require('./exporter')
const args = require('args')

args
  .option('template', 'The template to run')
  .option('path', 'The path to the swagger file (supports yaml or json)', 'swagger.json')
  .option('out', 'The output path', 'out')
  .option('configs', 'The path to the configs', './configs')
  .option('templates', 'The path to the templates', './templates')

const flags = args.parse(process.argv)

if (!flags.template) {
  console.log('Please supply a template')
} else {
  exporter(flags)
}
