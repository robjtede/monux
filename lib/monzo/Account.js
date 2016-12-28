'use strict'

const Transaction = require('./Transaction')

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
    }).then(txs => txs.transactions.map(tx => new Transaction(this.monzo, this, tx)))
  }
}

module.exports = Account
