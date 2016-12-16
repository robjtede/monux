'use strict'

const url = require('url')
const querystring = require('querystring')

const rp = require('request-promise')

class Account {
  constructor (monzo, acc) {
    this.monzo = monzo
    this.acc = acc
  }

  get id () {
    return this.acc.id
  }

  get balance () {
    return this.monzo.request('/balance', {
      'account_id': this.id
    })
  }

  get transactions () {
    return this.monzo.request('/transactions', {
      'expand[]': 'merchant',
      'account_id': this.id
    }).then(trs => trs.transactions)
  }

}

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
