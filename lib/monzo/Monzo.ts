import * as rp from 'request-promise-native'

import { Account, IMonzoApiAccount } from './'
import { getSavedCode } from './auth'

export default class Monzo {
  private proto: string
  private apiRoot: string
  private access: string

  constructor(accessResponse: string) {
    this.proto = 'https://'
    this.apiRoot = 'api.monzo.com'
    this.access = accessResponse
  }

  public request(path = '/ping/whoami', qs = {}, method = 'GET', json = true) {
    method = method.toUpperCase()

    const headers = {
      Authorization: `Bearer ${this.access}`
    }

    const opts = {
      method,
      uri: `${this.proto}${this.apiRoot}${path}`,
      [method === 'GET' ? 'qs' : 'form']: qs,
      headers,
      json
    }

    return rp(opts)
  }

  get accounts(): Promise<Account[]> {
    return this.request('/accounts').then(accs =>
      accs.accounts.map((acc: IMonzoApiAccount) => new Account(this, acc))
    )
  }
}

export const getMonzo = (() => {
  const accessToken = getSavedCode('access_token')

  return async (): Promise<Monzo> => {
    return new Monzo(await accessToken)
  }
})()
