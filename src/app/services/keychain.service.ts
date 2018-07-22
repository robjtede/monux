import keychain = require('keytar')
import Debug = require('debug')

import { Injectable, isDevMode } from '@angular/core'

const debug = Debug('app:service:keychain')

export type MonzoSavableCodes =
  | 'client_id'
  | 'client_secret'
  | 'access_token'
  | 'refresh_token'

export interface Keychain {
  accounts?: {
    monzo?: { [T in MonzoSavableCodes]?: string }
  }
}

const ACCOUNT = 'Monux'
const SERVICE = isDevMode
  ? 'monux_dev'
  : process && process.env && process.env.NODE_ENV === 'test'
    ? 'monux_test'
    : 'monux'

@Injectable()
export class KeychainService {
  async keychainExists(): Promise<boolean> {
    debug(`checking existence of ${SERVICE} keychain`)
    return !!(await keychain.getPassword(SERVICE, ACCOUNT))
  }

  async getKeychain(): Promise<Keychain> {
    debug(`getting entire ${SERVICE} keychain`)

    const chain = await keychain.getPassword(SERVICE, ACCOUNT)

    if (chain) return JSON.parse(chain)
    else throw new Error('monux keychain does not exist')
  }

  overwriteKeychain(chain: Keychain): Promise<void> {
    debug(`overwriting ${SERVICE} keychain`)
    return keychain.setPassword(SERVICE, ACCOUNT, JSON.stringify(chain))
  }
}
