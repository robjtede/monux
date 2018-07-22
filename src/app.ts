import Debug = require('debug')
import { app, EventEmitter, ipcMain } from 'electron'
import { resolve } from 'path'
import { install as installExifRotate } from 'electron-exif-rotate'

import { WindowManager } from './window-manager'

const debug = Debug('app:app')

debug(`starting`, app.getName(), 'version', app.getVersion())

export const wm = new WindowManager()

// associate `monux://` urls with app
if (!app.isDefaultProtocolClient(app.getName().toLowerCase())) {
  app.setAsDefaultProtocolClient(app.getName().toLowerCase())
}

// load auto reloader in development
if (!app.isPackaged) {
  debug('starting auto reloader')
  import('electron-reload')
    .then(reloader => reloader(resolve(__dirname)))
    .catch(console.error)
}

// electron events

app.on('ready', () => {
  debug('ready event')

  // configure HTTPS interceptor for auto image rotation
  installExifRotate()

  // load devtool extensions in development
  if (!app.isPackaged) loadDevtoolExtensions()

  wm.goToMonux()
})

app.on('open-url', async (_, forwardedUrl) => {
  debug('open-url event')
  forwardAuthUrl(forwardedUrl)
})

app.on('window-all-closed', () => {
  debug('window-all-closed event')
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  debug('activate event')
  if (wm.hasMainWindow()) wm.focusMainWindow()
  else wm.goToMonux()
})

// ipc events

ipcMain.on('open-auth-window', (_ev: EventEmitter, url: string) => {
  debug('opening auth request window')
  wm.openAuthRequest(url)
})

ipcMain.on('auth-success:monzo', () => {
  wm.closeAuthRequest()
})

// helpers

function forwardAuthUrl(forwardedUrl: string) {
  wm.mainWindow.webContents.send('auth-verify:monzo', forwardedUrl)
}

// TODO: `makeSingleInstance` deprecated in electron 3
const isSecondInstance = app.makeSingleInstance(async (argv, _) => {
  // focus main window if second instance started
  if (wm.hasMainWindow() && wm.mainWindow.isMinimized()) {
    wm.mainWindow.restore()
  }
  wm.focusMainWindow()

  if (process.platform === 'win32' && argv.length > 1) {
    const authUrl = argv.find(param => {
      return param.toLowerCase().startsWith('monux://')
    })

    if (authUrl) {
      forwardAuthUrl(authUrl)
    } else {
      console.error('Auth URL not found')
      throw new Error('Auth URL not found')
    }
  }
})

if (isSecondInstance) {
  app.quit()
}

function loadDevtoolExtensions() {
  debug('loading devtool extensions')

  import('devtron')
    .then(({ install }) => install())
    .catch(console.error)

  import('electron-devtools-installer')
    .then(({ default: installExtension, REDUX_DEVTOOLS }) => {
      const extensions = [
        installExtension(REDUX_DEVTOOLS),
        installExtension('elgalmkoelokbchhkhacckoklkejnhcd')
      ]

      return Promise.all(extensions)
        .then(names => debug('Added Extensions:', names.join(', ')))
        .catch(err => debug('An error occurred adding extension:', err))
    })
    .catch(console.error)
}
