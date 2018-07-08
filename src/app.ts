import { randomBytes } from 'crypto'
import { resolve } from 'path'
import { parse as parseQueryString } from 'querystring'
import { parse as parseUrl } from 'url'
import Debug = require('debug')

import { app, ipcMain, EventEmitter } from 'electron'

import {
  getAccessToken,
  verifyAccess,
  getSavedCode,
  saveCode,
  getAuthRequestUrl
} from './lib/monzo/auth'
import { WindowManager } from './window-manager'

const debug = Debug('app:app')

debug(`starting`, app.getName(), 'version', app.getVersion())

export const wm = new WindowManager()

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

export interface AppInfo {
  client_id: string
  client_secret: string
  redirect_uri: string
  response_type: string
  state: string
}

const getAppInfo = (() => {
  const state = new Promise<string>((resolve, reject) => {
    randomBytes(128, (err, buf) => {
      if (err) reject(err)
      resolve(buf.toString('hex'))
    })
  })

  return async (): Promise<AppInfo> => {
    return {
      client_id: await getSavedCode('client_id'),
      client_secret: await getSavedCode('client_secret'),
      redirect_uri: 'https://monux.robjte.de/auth/',
      response_type: 'code',
      state: await state
    }
  }
})()

const parseAuthUrl = async (forwardedUrl: string) => {
  const appInfo = await getAppInfo()
  // TODO: swap out for URL construct
  // TODO: handle no query
  const query = parseUrl(forwardedUrl).query as string
  const authResponse = parseQueryString(query)

  if (authResponse.state !== appInfo.state) {
    debug('App state:', appInfo.state)
    debug('Auth state:', authResponse.state)
    console.error('Auth state mismatch')
    throw new Error('Auth state mismatch')
  }

  const authCode = authResponse.code
  debug('authcode =>', authCode)

  try {
    const { accessToken, refreshToken } = await getAccessToken(
      appInfo,
      authCode as string
    )

    debug('token =>', accessToken)
    if (await verifyAccess(accessToken)) {
      await saveCode('access_token', accessToken)

      if (refreshToken) await saveCode('refresh_token', refreshToken)
      else debug('no refresh token sent')

      wm.mainWindow.webContents.send('auth-verify:monzo', accessToken)
      wm.closeAuthRequest()
    } else {
      console.error('Invalid access token')
      throw new Error('Invalid access token')
    }
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

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
      try {
        await parseAuthUrl(authUrl)
      } catch (err) {
        console.error(err)
        throw new Error(err)
      }
    } else {
      console.error('Auth url not found')
      throw new Error('Auth url not found')
    }
  }
})

if (isSecondInstance) {
  app.quit()
}

app.on('ready', async () => {
  debug('ready event')

  // load devtool extensions in development
  if (!app.isPackaged) loadDevtoolExtensions()

  wm.goToMonux()

  ipcMain.on('open-auth-window', async (_ev: EventEmitter, bank: string) => {
    debug('opening auth request window for', bank)

    const appInfo = await getAppInfo()
    const url = getAuthRequestUrl(appInfo)
    wm.openAuthRequest(url)
  })

  ipcMain.on('auth-verify:monzo', async (_ev: EventEmitter, url: string) => {
    debug('getting acceess token from manually entered code')
    await parseAuthUrl(url)
  })
})

app.on('open-url', async (_, forwardedUrl) => {
  debug('open-url event')
  await parseAuthUrl(forwardedUrl)
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
