'use strict'

const Transaction = require('./Transaction')
const Amount = require('./Amount')

class Account {
  constructor (monzo, acc) {
    this.monzo = monzo
    this.acc = acc
  }

  get id () {
    return this.acc.id
  }

  get balance () {
    return this.monzo
      .request('/balance', {
        'account_id': this.id
      })
      .then(bal => {
        console.log(bal)
        return {
          balance: new Amount(bal.balance, bal.currency),
          spentToday: new Amount(bal.spend_today, bal.currency)
        }
      })
  }

  get transactions () {
    return this.monzo
      .request('/transactions', {
        'expand[]': 'merchant',
        'account_id': this.id
      })
      .then(txs => txs
        .transactions
        .map(tx => new Transaction(this.monzo, this, tx))
      )
  }
}

module.exports = Account
