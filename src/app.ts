import { randomBytes } from 'crypto'
import { resolve } from 'path'
import { parse as parseQueryString } from 'querystring'
import { format, parse as parseUrl } from 'url'

import { oneLineTrim } from 'common-tags'
import * as Debug from 'debug'

import {
  app,
  BrowserWindow,
  Menu,
  shell
} from 'electron'

import { enableLiveReload } from 'electron-compile'
import * as Config from 'electron-config'
import * as rp from 'request-promise-native'
import windowState = require('electron-window-state')

const config = new Config()
const debug = Debug('app:app.js')

console.info(`starting ${app.getName()} version ${app.getVersion()}`)

const appInfo = {
  client_id: config.get('client_id') as string,
  client_secret: config.get('client_secret') as string,
  redirect_uri: 'monux://auth/',
  response_type: 'code',
  state: randomBytes(512).toString('hex')
}

enableLiveReload()

let mainWindow: Electron.BrowserWindow | undefined
let authWindow: Electron.BrowserWindow | undefined
let clientDetailsWindow: Electron.BrowserWindow | undefined

const template: Electron.MenuItemOptions[] = [
  {
    label: 'Application',
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { role: 'quit' }
    ]
  }, {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectall' }
    ]
  }, {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { role: 'resetzoom' }
    ]
  }, {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  }, {
    role: 'help',
    submenu: [
      { label: 'Monux GitHub Repo', click: () => shell.openExternal('https://github.com/robjtede/monux') },
      { label: 'Learn More About Electron', click: () => shell.openExternal('http://electron.atom.io') }
    ]
  }
]

const checkAccess = (): boolean => {
  debug('checkAccess')

  if (!config.has('accessToken')) {
    debug('=> no access token')
    return false
  }

  if (config.has('authTime') && config.has('authExpires')) return checkAuthTimeout()
  else return false
}

const checkAuthTimeout = (): boolean => {
  debug('checkAuthTimeout')

  const valid = config.get('authTime') + config.get('authExpires') > Date.now()

  if (!valid) debug('=> access token expired')
  return valid
}

const createWindow = (): void => {
  debug('createWindow')

  const mainWindowState = windowState({
    defaultHeight: 800,
    defaultWidth: 1000
  })

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 600,
    minHeight: 600,
    titleBarStyle: 'hidden-inset',
    webPreferences: {
      experimentalFeatures: true
    }
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  mainWindow.loadURL(format({
    pathname: resolve(__dirname, '..', 'app', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindowState.manage(mainWindow)

  mainWindow.on('closed', () => { mainWindow = undefined })
}

const requestAuth = (): void => {
  debug('requestAuth')

  debug('clearing auth details')

  authWindow = new BrowserWindow({
    width: 500,
    height: 700
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  // get auth token
  const url = oneLineTrim`
    https://auth.getmondo.co.uk/
    ?client_id=${appInfo.client_id}
    &redirect_uri=${appInfo.redirect_uri}
    &response_type=${appInfo.response_type}
    &state=${appInfo.state}
  `

  authWindow.loadURL(url)
}

const getAccessToken = async () => {
  debug('getAccessToken')

  const opts = {
    uri: 'https://api.monzo.com/oauth2/token',
    method: 'post',
    form: {
      grant_type: 'authorization_code',
      client_id: appInfo.client_id,
      client_secret: appInfo.client_secret,
      redirect_uri: appInfo.redirect_uri,
      code: config.get('authCode')
    },
    json: true
  }

  try {
    const res = await rp(opts)

    debug(`getAccessToken => ${typeof res}: ${res}`)
    return res
  } catch (err) {
    console.error(`getAccessToken => ${err.code}`)
    throw err
  }
}

const verifyAccess = async () => {
  debug(`verifyAccess with: ${config.get('accessToken')}`)

  const opts = {
    uri: 'https://api.monzo.com/ping/whoami',
    headers: {
      Authorization: `Bearer ${config.get('accessToken')}`
    },
    json: true
  }

  try {
    const res = await rp(opts)

    debug(`verifyAccess => ${typeof res}: ${res}`)
    return res
  } catch (err) {
    console.error('verifyAccess =>', err)
    throw err
  }
}

const clientDetails = async () => {
  clientDetailsWindow = new BrowserWindow({
    width: 400,
    height: 600
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  clientDetailsWindow.loadURL(format({
    pathname: resolve(__dirname, '..', 'app', 'get-client-info.html'),
    protocol: 'file:',
    slashes: true
  }))

  clientDetailsWindow.on('closed', async () => {
    clientDetailsWindow = undefined

    appInfo.client_id = config.get('client_id')
    appInfo.client_secret = config.get('client_secret')

    if (!checkAccess()) {
      requestAuth()
      return
    }

    try {
      const res = await verifyAccess()

      if (res && 'authenticated' in res && res.authenticated) createWindow()
      else requestAuth()
    } catch (err) {
      console.error(err.message)
    }
  })
}

app.on('ready', async () => {
  debug('ready event')

  if (!(config.has('client_id') && config.has('client_secret'))) {
    config.clear()
    clientDetails()
    return
  }

  if (!checkAccess()) {
    requestAuth()
    return
  }

  try {
    const res = await verifyAccess()

    if (res && 'authenticated' in res && res.authenticated) createWindow()
    else requestAuth()
  } catch (err)  {
    console.error(err.message)
  }
})

app.on('open-url', async (_, forwardedUrl) => {
  debug('open-url event')

  if (authWindow) authWindow.close()

  const query = parseUrl(forwardedUrl).query
  const authResponse = parseQueryString(query)

  if (authResponse.state !== appInfo.state) {
    console.error('auth state mismatch')
    throw new Error('auth state mismatch')
  }

  debug(`authResponse code => ${authResponse.code}`)

  config.set('authCode', authResponse.code)

  try {
    const res = await getAccessToken()

    config.set({
      accessToken: res.access_token,
      authExpires: res.expires_in * 1000,
      authTime: +new Date()
    })

    await verifyAccess()

    debug('open-url event => verifyAccess.then')

    createWindow()
  } catch (err)  {
    console.error(err.message)
  }
})

app.on('window-all-closed', () => {
  debug('window-all-closed event')

  // conflicts with auth strategy for now
  // if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  debug('activate event')
  if (!mainWindow) createWindow()
})
