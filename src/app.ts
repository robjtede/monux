import { randomBytes } from 'crypto'
import { resolve } from 'path'
import { parse as parseQueryString } from 'querystring'
import { format, parse as parseUrl } from 'url'

import { oneLineTrim } from 'common-tags'
import * as Debug from 'debug'

import { app, BrowserWindow, Menu } from 'electron'
import { enableLiveReload } from 'electron-compile'
import windowState = require('electron-window-state')

import { deletePassword, getPassword, setPassword } from './keychain'
import { getAccessToken, refreshAccess, verifyAccess } from './oauth'
import menuTemplate from './menu-template'

const debug = Debug('app:app.js')

debug(`starting ${app.getName()} version ${app.getVersion()}`)

export interface IAppInfo {
  client_id: string
  client_secret: string
  redirect_uri: string
  response_type: string
  state: string
}

const getAppInfo = (() => {
  const clientId = getPassword({
    account: 'Monux',
    service: 'monux.monzo.client_id'
  })
  const clientSecret = getPassword({
    account: 'Monux',
    service: 'monux.monzo.client_secret'
  })
  const state = new Promise<string>((resolve, reject) => {
    randomBytes(512, (err, buf) => {
      if (err) reject(err)
      resolve(buf.toString('hex'))
    })
  })

  return async (): Promise<IAppInfo> => {
    return {
      client_id: await clientId,
      client_secret: await clientSecret,
      redirect_uri: 'monux://auth/',
      response_type: 'code',
      state: await state
    }
  }
})()

enableLiveReload()

let mainWindow: Electron.BrowserWindow | undefined
let authWindow: Electron.BrowserWindow | undefined
let clientDetailsWindow: Electron.BrowserWindow | undefined

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

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))

  mainWindow.loadURL(
    format({
      pathname: resolve(__dirname, '..', 'app', 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  )

  mainWindowState.manage(mainWindow)

  mainWindow.on('closed', () => {
    mainWindow = undefined
  })
}

const requestAuth = async () => {
  debug('requestAuth')

  debug('clearing auth details')

  authWindow = new BrowserWindow({
    width: 500,
    height: 700
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))

  const appInfo = await getAppInfo()

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

const getClientDetails = async () => {
  clientDetailsWindow = new BrowserWindow({
    width: 400,
    height: 600
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))

  clientDetailsWindow.loadURL(
    format({
      pathname: resolve(__dirname, '..', 'app', 'get-client-info.html'),
      protocol: 'file:',
      slashes: true
    })
  )

  clientDetailsWindow.on('closed', async () => {
    clientDetailsWindow = undefined

    // requestAuth()

    const token = await getPassword({
      account: 'Monux',
      service: 'monux.monzo.access_token'
    })

    try {
      const res = await verifyAccess(token)

      if (res) createWindow()
      else requestAuth()
    } catch (err) {
      console.error(err)
      throw new Error(err)
    }
  })
}

app.on('ready', async () => {
  debug('ready event')

  try {
    const appInfo = await getAppInfo()
    const savedToken = await getPassword({
      account: 'Monux',
      service: 'monux.monzo.access_token'
    })

    debug('monzo client =>', appInfo.client_id)

    if (await verifyAccess(savedToken)) {
      createWindow()
    }
  } catch (err) {
    await requestAuth()
  }
})

app.on('open-url', async (_, forwardedUrl) => {
  debug('open-url event')

  const appInfo = await getAppInfo()

  if (authWindow) authWindow.close()

  const query = parseUrl(forwardedUrl).query
  const authResponse = parseQueryString(query)

  if (authResponse.state !== appInfo.state) {
    console.error('auth state mismatch')
    throw new Error('auth state mismatch')
  }

  const authCode = authResponse.code
  debug('authcode =>', authCode)

  try {
    const { accessToken, refreshToken } = await getAccessToken(
      appInfo,
      authCode
    )

    const access = await verifyAccess(accessToken)
    debug('token =>', accessToken)

    await setPassword({
      account: 'Monux',
      service: 'monux.monzo.access_token',
      password: accessToken
    })

    createWindow()
  } catch (err) {
    console.error(err)
    throw new Error(err)
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
