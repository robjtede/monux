import { randomBytes } from 'crypto'
import { parse as parseQueryString } from 'querystring'
import { parse as parseUrl } from 'url'
import Debug = require('debug')

import { app } from 'electron'

import {
  getAccessToken,
  refreshAccess,
  verifyAccess,
  getSavedCode,
  saveCode
} from './lib/monzo/auth'
import { WindowManager } from './window-manager'

const debug = Debug('app:app')

debug(`starting`, app.getName(), 'version', app.getVersion())

const mainWindow = new WindowManager()

if (!app.isDefaultProtocolClient(app.getName().toLowerCase())) {
  app.setAsDefaultProtocolClient(app.getName().toLowerCase())
}

import('electron-reload')
  .then(reloader => reloader(__dirname))
  .catch(console.error)

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

      mainWindow.goToMonux()
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
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow.hasWindow && mainWindow.window.isMinimized()) {
    mainWindow.window.restore()
  }
  mainWindow.focus()

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

  import('electron-devtools-installer').then(
    ({ default: installExtension, REDUX_DEVTOOLS }) => {
      const extensions = [
        installExtension(REDUX_DEVTOOLS),
        installExtension('elgalmkoelokbchhkhacckoklkejnhcd')
      ]

      return Promise.all(extensions)
        .then(names => console.log('Added Extensions:', names.join(', ')))
        .catch(err => console.log('An error occurred adding extension:', err))
    }
  )

  import('devtron').then(({ install }) => install())

  mainWindow.goToMonux()

  // try {
  //   const appInfo = await getAppInfo()

  //   try {
  //     const accessToken = await getSavedCode('access_token')

  //     try {
  //       const access = await verifyAccess(accessToken)

  //       if (access) {
  //         mainWindow.goToMonux()
  //       } else {
  //         try {
  //           const refreshToken = await getSavedCode('refresh_token')

  //           const {
  //             accessToken: newAccessToken,
  //             refreshToken: newRefreshToken
  //           } = await refreshAccess(appInfo, refreshToken)

  //           if (await verifyAccess(newAccessToken)) {
  //             await saveCode('access_token', newAccessToken)
  //             await saveCode('refresh_token', newRefreshToken)

  //             mainWindow.goToMonux()
  //           } else {
  //             console.error('Invalid refresh token')
  //             throw new Error('Invalid refresh token')
  //           }
  //         } catch (err) {
  //           debug('no refresh token found')
  //           mainWindow.goToAuthRequest(appInfo)
  //         }
  //       }
  //     } catch (err) {
  //       console.warn(err.name)
  //       if (err.name === 'RequestError') mainWindow.goToMonux()
  //       else throw new Error(err)
  //     }
  //   } catch (err) {
  //     debug('no access token found')
  //     mainWindow.goToAuthRequest(appInfo)
  //   }
  // } catch (err) {
  //   debug('no client info found')
  //   mainWindow.goToClientInfo()
  // }
})

app.on('open-url', async (_, forwardedUrl) => {
  debug('open-url event')

  await parseAuthUrl(forwardedUrl)
})

app.on('window-all-closed', () => {
  debug('window-all-closed event')

  // conflicts with auth strategy for now
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  debug('activate event')
  if (mainWindow.hasWindow) mainWindow.focus()
  else mainWindow.goToMonux()
})
