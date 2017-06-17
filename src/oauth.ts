import * as Debug from 'debug'
import * as rp from 'request-promise-native'

import { IAppInfo } from './app'

const debug = Debug('app:oauth.js')

export const getAccessToken = async (appInfo: IAppInfo, authCode: string) => {
  debug('getAccessToken')

  const opts = {
    uri: 'https://api.monzo.com/oauth2/token',
    method: 'post',
    form: {
      grant_type: 'authorization_code',
      client_id: appInfo.client_id,
      client_secret: appInfo.client_secret,
      redirect_uri: appInfo.redirect_uri,
      code: authCode
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

export const verifyAccess = async (token: string) => {
  debug(`verifyAccess with: ${token}`)

  const opts = {
    uri: 'https://api.monzo.com/ping/whoami',
    headers: {
      Authorization: `Bearer ${token}`
    },
    json: true
  }

  try {
    const res = await rp(opts)
    debug(`verifyAccess => ${typeof res}: ${res}`)

    if (res && 'authenticated' in res && res.authenticated) {
      return true
    } else {
      return false
    }
  } catch (err) {
    console.error('verifyAccess => ', err)
    throw err
  }
}

export const refreshAccess = async () => {}
