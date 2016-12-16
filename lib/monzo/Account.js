'use strict'

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

module.exports = Account
