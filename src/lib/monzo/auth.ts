import { URL } from 'url'
import rp = require('request-promise-native')
import Debug = require('debug')

import { AppInfo } from 'monzolib'
import { getPassword, setPassword, deletePassword } from '../keychain'

const debug = Debug('app:monzo:auth')

const ACCOUNT = 'Monux'
const SERVICE = 'monux'
const MONZO_SERVICE = `${SERVICE}.monzo`

export type MonzoSaveableCodes =
  | 'client_id'
  | 'client_secret'
  | 'access_token'
  | 'refresh_token'

export const getSavedCode = async (
  code: MonzoSaveableCodes
): Promise<string> => {
  debug('getting code =>', `${MONZO_SERVICE}.${code}`)

  return getPassword({
    account: ACCOUNT,
    service: `${MONZO_SERVICE}.${code}`
  })
}

export const saveCode = async (
  code: MonzoSaveableCodes,
  value: string
): Promise<void> => {
  debug('saving code =>', `${MONZO_SERVICE}.${code}`)

  return setPassword({
    account: ACCOUNT,
    service: `${MONZO_SERVICE}.${code}`,
    password: value
  })
}

export const deleteSavedCode = async (
  code: MonzoSaveableCodes
): Promise<{}> => {
  debug('deleting code =>', `${MONZO_SERVICE}.${code}`)

  return deletePassword({
    account: ACCOUNT,
    service: `${MONZO_SERVICE}.${code}`
  })
}

export const getAccessToken = async (
  appInfo: AppInfo,
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

export const getAuthRequestUrl = (appInfo: AppInfo): string => {
  const url = new URL('https://auth.monzo.com')

  url.searchParams.set('client_id', appInfo.client_id)
  url.searchParams.set('redirect_uri', appInfo.redirect_uri)
  url.searchParams.set('response_type', appInfo.response_type)
  url.searchParams.set('state', appInfo.state)

  return url.toString()
}

export const refreshAccess = async (appInfo: AppInfo, refreshToken: string) => {
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
    debug(
      'refreshAccess =>',
      res &&
      ('refresh_token' in res && res.refresh_token) &&
      ('access_token' in res && res.access_token)
        ? '✓'
        : '✘'
    )

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

    if (err.name === 'RequestError') throw err
    else throw new Error(err)
  }
}
