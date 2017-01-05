'use strict'

const rp = require('request-promise')

const Account = require('./Account')

/**
 * Monzo
 * Takes access token
 */
class Monzo {
  constructor (accessResponse) {
    this.proto = 'https://'
    this.apiRoot = 'api.monzo.com'
    this.access = accessResponse
  }

  request (path = '/ping/whoami', qs = {}, method = 'GET', json = true) {
    method = method.toUpperCase()

    const headers = {
      'Authorization': `Bearer ${this.access}`
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

  get accounts () {
    return this
      .request('/accounts')
      .then(accs => accs
        .accounts
        .map(acc => new Account(this, acc))
      )
  }
}

module.exports = Monzo
