const exporter = require('../lib/exporter')
const fs = require('fs-extra')
const path = require('path')

test('typescript-models has expected output', () => {
  createEmptyTestDirectory('./tests/out')
  exporter({ path: './tests/support/sample.yaml', out: './tests/out/typedefs.ts' })
  assertDirectoryContentsIsEqual('./tests/out', './tests/support/expected-outputs/typescript-models')
})

function assertDirectoryContentsIsEqual(expectedDir, outputDir) {
  fs.readdirSync(expectedDir).forEach(file => {
    const expectedFilePath = path.join(expectedDir, file)
    const outputFilePath = path.join(outputDir, file)
    expect(fs.existsSync(outputFilePath)).toBe(true)
    const expectedFileContents = fs.readFileSync(expectedFilePath, 'utf8')
    const outputFileContents = fs.readFileSync(outputFilePath, 'utf8')
    expect(outputFileContents).toBe(expectedFileContents)
  })
}

function createEmptyTestDirectory (dir) {
  fs.removeSync(dir)
  fs.mkdirSync(dir)
}