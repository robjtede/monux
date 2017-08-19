'use strict'

var packager = require('electron-packager')
const pkg = require('./package.json')
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

const pack = (plat, arch, cb) => {
  // there is no darwin ia32 electron
  if (plat === 'darwin' && arch === 'ia32') return

  const iconExt =
    plat === 'darwin' ? '.icns' : plat === 'win32' ? 'ico' : '.png'

  const opts = Object.assign({}, DEFAULT_OPTS, {
    platform: plat,
    icon: `src/favicon${iconExt}`,
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

  console.log(opts)
  packager(opts, cb)
}

pack(platform, arch, (err, appPath) => {
  if (err) console.log(err)
  else console.log('Application packaged successfuly!', appPath)
})
