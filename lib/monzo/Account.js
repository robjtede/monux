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

  get name () {
    return this.description
  }

  get description () {
    return this.acc.description
  }

  get created () {
    return this.acc.created
  }

  get balance () {
    return this.monzo
      .request('/balance', {
        'account_id': this.id
      })
      .then(bal => {
        // console.log(bal)

        return {
          balance: new Amount({
            raw: bal.balance,
            currency: bal.currency,
            localRaw: bal.balance * bal.local_exchange_rate,
            localCurrency: bal.local_currency
          }),

          spentToday: new Amount({
            raw: bal.spend_today,
            currency: bal.currency,
            localRaw: bal.local_spend.length > 0 ? bal.local_spend[0].spend_today * bal.local_exchange_rate : 0,
            localCurrency: bal.local_currency
          })
        }
      })
  }

  get transactions () {
    return this.monzo
      .request('/transactions', {
        'expand[]': 'merchant',
        'account_id': this.id
      })
      .then(txs => {
        localStorage.setItem('transactions', JSON.stringify(txs.transactions))

        return txs
      })
      .then(txs => txs
        .transactions
        .map((tx, index) => {
          tx = new Transaction(this.monzo, this, tx, index)

          return tx
        })
      )
  }
}

module.exports = Account
