const { resolve, join } = require('path')

const rootDir = resolve(__dirname, '..')

const root = (...args) => {
  return join(rootDir, ...args)
}

module.exports.root = root
