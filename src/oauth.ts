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
    debug('getAccessToken =>', res)

    return {
      accessToken: res.access_token,
      refreshToken: res.refresh_token
    }
  } catch (err) {
    console.error('getAccessToken failed =>', err.error)
    throw new Error(err)
  }
}

export const refreshAccess = async (
  appInfo: IAppInfo,
  refreshToken: string
) => {
  debug('refreshAccess')

  const opts = {
    uri: 'https://api.monzo.com/oauth2/token',
    method: 'post',
    form: {
      grant_type: 'refresh_token',
      client_id: appInfo.client_id,
      client_secret: appInfo.client_secret,
      refresh_token: refreshToken
    },
    json: true
  }

  try {
    const res = await rp(opts)
    debug('refreshAccess =>', res)

    return {
      accessToken: res.access_token,
      refreshToken: res.refresh_token
    }
  } catch (err) {
    console.error('refreshAccess failed =>', err.error)
    throw new Error(err)
  }
}

export const verifyAccess = async (accessToken: string) => {
  debug('verifyAccess with =>', accessToken)

  const opts = {
    uri: 'https://api.monzo.com/ping/whoami',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    json: true
  }

  try {
    const res = await rp({
      ...opts,
      simple: false
    })
    debug('verifyAccess =>', res)

    return res && 'authenticated' in res && res.authenticated
  } catch (err) {
    console.error('verifyAccess failed =>', err.error)
    throw new Error(err)
  }
}
