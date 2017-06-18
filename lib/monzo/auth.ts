import * as Debug from 'debug'

import * as rp from 'request-promise-native'

import { IAppInfo } from '../../src/app'
import { getPassword, setPassword } from '../keychain'

const debug = Debug('monzo:auth')

const ACCOUNT = 'Monux'
const SERVICE = 'monux'
const MONZO_SERVICE = `${SERVICE}.monzo`

export type EMonzoSaveableCodes =
  | 'client_id'
  | 'client_secret'
  | 'access_token'
  | 'refresh_token'

export const getSavedCode = async (
  code: EMonzoSaveableCodes
): Promise<string> => {
  debug('getting code =>', `${MONZO_SERVICE}.${code}`)

  return getPassword({
    account: ACCOUNT,
    service: `${MONZO_SERVICE}.${code}`
  })
}

export const saveCode = async (
  code: EMonzoSaveableCodes,
  value: string
): Promise<{}> => {
  debug('saving code =>', `${MONZO_SERVICE}.${code}`)

  return setPassword({
    account: ACCOUNT,
    service: `${MONZO_SERVICE}.${code}`,
    password: value
  })
}

export const getAccessToken = async (
  appInfo: IAppInfo,
  authCode: string
): Promise<{ accessToken: string; refreshToken: string }> => {
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
    debug(
      'verifyAccess =>',
      res && 'authenticated' in res && res.authenticated ? '✓' : '✘'
    )

    return res && 'authenticated' in res && res.authenticated
  } catch (err) {
    console.error('verifyAccess failed =>', err.error)
    throw new Error(err)
  }
}
