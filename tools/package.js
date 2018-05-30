'use strict'

const packager = require('electron-packager')
const pkg = require('../package.json')
const argv = require('minimist')(process.argv.slice(1))

const shouldBuildAll = argv.all || false
const arch = argv.arch || 'all'
const platform = argv.platform || 'darwin'

const DEFAULT_OPTS = {
  dir: './dist',
  name: pkg.name,
  asar: true,
  buildVersion: pkg.version
}

const pack = (platform, arch, cb) => {
  // there is no darwin ia32 electron
  if (platform === 'darwin' && arch === 'ia32') return

  const iconExt =
    platform === 'darwin' ? '.icns' : platform === 'win32' ? 'ico' : '.png'

  const opts = Object.assign({}, DEFAULT_OPTS, {
    platform,
    icon: `./src/monux${iconExt}`,
    arch,
    prune: true,
    overwrite: true,
    all: shouldBuildAll,
    out: 'out',
    protocols: [
      {
        schemes: ['monux'],
        name: 'Monux'
      }
    ]
  })

  console.log('packager options:', opts)
  return packager(opts)
}

pack(platform, arch)
  .then(appPath => {
    console.log('Application packaged successfuly!', appPath)
  })
  .catch(err => {
    console.log(err)
  })
