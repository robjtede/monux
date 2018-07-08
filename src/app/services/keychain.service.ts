import keychain = require('keytar')
import Debug = require('debug')

import { Injectable, isDevMode } from '@angular/core'
import { Observable, from, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

const debug = Debug('app:service:keychain')

export interface MonzoSavableCodes {
  client_id: string
  client_secret: string
  access_token: string
  refresh_token: string
}

export interface Keychain {
  accounts?: {
    monzo?: { [T in keyof MonzoSavableCodes]?: string }
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
  hasKeychain(): Observable<boolean> {
    debug(`checking existence of ${SERVICE} keychain`)
    return from(keychain.getPassword(SERVICE, ACCOUNT)).pipe(
      map(chain => !!chain)
    )
  }

  getKeychain(): Observable<Keychain> {
    debug(`getting entire ${SERVICE} keychain`)
    return from(keychain.getPassword(SERVICE, ACCOUNT)).pipe(
      switchMap(chain => {
        if (!chain) {
          throw new Error('monux keychain does not exist')
        } else {
          return of(JSON.parse(chain))
        }
      })
    )
  }

  overwriteKeychain(chain: Keychain): Observable<void> {
    debug(`overwriting ${SERVICE} keychain`)
    return from(keychain.setPassword(SERVICE, ACCOUNT, JSON.stringify(chain)))
  }
}
