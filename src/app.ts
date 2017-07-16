import { randomBytes } from 'crypto'
import { parse as parseQueryString } from 'querystring'
import { parse as parseUrl } from 'url'
import * as Debug from 'debug'

import { app } from 'electron'
import { enableLiveReload } from 'electron-compile'

import {
  getAccessToken,
  refreshAccess,
  verifyAccess,
  getSavedCode,
  saveCode
} from '../lib/monzo/auth'
import WindowManager from './window-manager'

const debug = Debug('app:app')
const mainWindow = new WindowManager()

enableLiveReload()

debug(`starting`, app.getName(), 'version', app.getVersion())

export interface IAppInfo {
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

  return async (): Promise<IAppInfo> => {
    return {
      client_id: await getSavedCode('client_id'),
      client_secret: await getSavedCode('client_secret'),
      redirect_uri: 'https://monux.robjte.de/auth/',
      response_type: 'code',
      state: await state
    }
  }
})()

app.on('ready', async () => {
  debug('ready event')

  try {
    const appInfo = await getAppInfo()

    try {
      const accessToken = await getSavedCode('access_token')

      try {
        const access = await verifyAccess(accessToken)

        if (access) {
          mainWindow.goToMonux()
        } else {
          try {
            const refreshToken = await getSavedCode('refresh_token')

            const {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken
            } = await refreshAccess(appInfo, refreshToken)

            if (await verifyAccess(newAccessToken)) {
              await saveCode('access_token', newAccessToken)
              await saveCode('refresh_token', newRefreshToken)

              mainWindow.goToMonux()
            } else {
              console.error('Invalid refresh token')
              throw new Error('Invalid refresh token')
            }
          } catch (err) {
            debug('no refresh token found')
            mainWindow.goToAuthRequest(appInfo)
          }
        }
      } catch (err) {
        console.warn(err.name)
        if (err.name === 'RequestError') mainWindow.goToMonux()
        else throw new Error(err)
      }
    } catch (err) {
      debug('no access token found')
      mainWindow.goToAuthRequest(appInfo)
    }
  } catch (err) {
    debug('no client info found')
    mainWindow.goToClientInfo()
  }
})

app.on('open-url', async (_, forwardedUrl) => {
  debug('open-url event')

  const appInfo = await getAppInfo()

  const query = parseUrl(forwardedUrl).query
  const authResponse = parseQueryString(query)

  if (authResponse.state !== appInfo.state) {
    console.error('Auth state mismatch')
    throw new Error('Auth state mismatch')
  }

  const authCode = authResponse.code
  debug('authcode =>', authCode)

  try {
    const { accessToken, refreshToken } = await getAccessToken(
      appInfo,
      authCode
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
})

app.on('window-all-closed', () => {
  debug('window-all-closed event')

  // conflicts with auth strategy for now
  // if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  debug('activate event')
  if (mainWindow.hasWindow) mainWindow.focus()
  else mainWindow.goToMonux()
})
