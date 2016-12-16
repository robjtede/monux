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

  request (path = '/ping/whoami', qs = {}, json = true) {
    return rp({
      uri: `${this.proto}${this.apiRoot}${path}`,
      qs: qs,
      headers: {
        'Authorization': `Bearer ${this.access}`
      },
      json: json
    })
  }

  get accounts () {
    return this.request('/accounts').then(accs => {
      return accs.accounts.map(acc => new Account(this, acc))
    })
  }
}

module.exports = Monzo
