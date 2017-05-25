
const path = require('path')
const url = require('url')
const querystring = require('querystring')
const crypto = require('crypto')
const Debug = require('debug')

import {
  app,
  Menu,
  shell,
  BrowserWindow
} from 'electron'

import { enableLiveReload } from 'electron-compile';

import * as rp from 'request-promise-native'
import * as Config from 'electron-config'
import windowState = require('electron-window-state')

const config = new Config()
const debug = new Debug('app:app.js')

console.log(`starting ${app.getName()} version ${app.getVersion()}`)

const appInfo = {
  client_id: config.get('client_id'),
  client_secret: config.get('client_secret'),
  redirect_uri: 'monux://auth/',
  response_type: 'code',
  state: crypto.randomBytes(512).toString('hex')
}

enableLiveReload();

let mainWindow: Electron.BrowserWindow | null
let authWindow: Electron.BrowserWindow | null
let clientDetailsWindow: Electron.BrowserWindow | null

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

  const valid = config.get('authTime') + config.get('authExpires') > +new Date()

  if (!valid) debug('=> access token expired')
  return valid
}

const createWindow = (): void => {
  debug('createWindow')

  const mainWindowState = windowState({
    defaultWidth: 1000,
    defaultHeight: 800
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

  mainWindow.loadURL(url.format({
    pathname: path.resolve(__dirname, '..', 'app', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindowState.manage(mainWindow)

  mainWindow.on('closed', () => { mainWindow = null })
}

const requestAuth = (): void => {
  debug('requestAuth')

  debug('clearing auth details')

  authWindow = new BrowserWindow({width: 500, height: 700})

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  // get auth token
  let url = 'https://auth.getmondo.co.uk/'
  url += `?client_id=${appInfo.client_id}`
  url += `&redirect_uri=${appInfo.redirect_uri}`
  url += `&response_type=${appInfo.response_type}`
  url += `&state=${appInfo.state}`

  authWindow.loadURL(url)
}

const getAccessToken = (): Promise<any> => {
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

  return rp(opts)
    .then(res => {
      // debug response info
      debug(`getAccessToken => ${typeof res}: ${res}`)

      return res
    }, err => {
      console.error(`getAccessToken => ${err.code}`)

      throw err
    })
}

const verifyAccess = (): Promise<any> => {
  debug(`verifyAccess with: ${config.get('accessToken')}`)

  const opts = {
    uri: 'https://api.monzo.com/ping/whoami',
    headers: {
      'Authorization': `Bearer ${config.get('accessToken')}`
    },
    json: true
  }

  return rp(opts)
    .then(res => {
      // debug response info
      debug(`verifyAccess => ${typeof res}: ${res}`)

      return res
    }, err => {
      console.error(`verifyAccess => ${err.message}`)

      throw err
    })
}

const clientDetails = (): void => {
  clientDetailsWindow = new BrowserWindow({
    width: 400,
    height: 600
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  clientDetailsWindow.loadURL(url.format({
    pathname: path.resolve(__dirname, '..', 'app', 'get-client-info.html'),
    protocol: 'file:',
    slashes: true
  }))

  clientDetailsWindow.on('closed', () => {
    clientDetailsWindow = null

    appInfo.client_id = config.get('client_id')
    appInfo.client_secret = config.get('client_secret')

    if (!checkAccess()) {
      requestAuth()
      return
    }

    verifyAccess()
      .then(res => {
        if (res && 'authenticated' in res && res.authenticated) createWindow()
        else requestAuth()
      })
      .catch(err => {
        console.error(err.message)
      })
  })
}

app.on('ready', () => {
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

  verifyAccess()
    .then(res => {
      if (res && 'authenticated' in res && res.authenticated) createWindow()
      else requestAuth()
    })
    .catch(err => {
      console.error(err.message)
    })
})

app.on('open-url', (_, forwardedUrl) => {
  debug('open-url event')

  if (authWindow) authWindow.close()

  const query = url.parse(forwardedUrl).query
  const authResponse = querystring.parse(query)

  if (authResponse.state !== appInfo.state) {
    console.error('auth state mismatch')
    throw new Error('auth state mismatch')
  }

  debug(`authResponse code => ${authResponse.code}`)

  config.set('authCode', authResponse.code)

  getAccessToken()
    .then(res => {
      config.set({
        accessToken: res.access_token,
        authExpires: res.expires_in * 1000,
        authTime: +new Date()
      })
    })
    .then(verifyAccess)
    .then(res => {
      debug(`open-url event => verifyAccess.then => ${res}`)

      createWindow()
    })
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
