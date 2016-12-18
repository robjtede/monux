'use strict'

// const {remote} = require('electron')

const Config = require('electron-config')
const config = new Config()

const Monzo = require('../lib/monzo/Monzo')

const monzo = new Monzo(config.get('accessToken'))
const debug = true

document.addEventListener('DOMContentLoaded', () => {
  Array.from(document.querySelectorAll('.fixable')).forEach(function (el) {
    window.Stickyfill.add(el)
  })

  monzo.accounts
    .then(accs => accs[0].transactions)
    .then(txs => {
      if (debug) console.log(txs)

      txs.reverse().forEach((tx, index) => {
        const txel = document.createElement('m-transaction')
        txel.tx = tx
        txel.setAttribute('index', index)

        document.querySelector('.transactions').appendChild(txel)
      })
    })

  monzo.accounts
    .then(accs => accs[0].balance)
    .then(bal => {
      if (debug) console.log(bal)

      document.querySelector('.card-balance').querySelector('h2').innerHTML = format(bal.balance, bal.currency)
      document.querySelector('.spent-today').querySelector('h2').innerHTML = format(Math.abs(bal.spend_today), bal.currency)
    })
})

const format = (amount, currency) => {
  amount /= 100

  if (amount < 0) amount = Math.abs(amount).toFixed(2)
  else amount = amount.toFixed(2)

  const parts = amount.split('.')
  amount = `<span class="major">${parts[0]}</span>.${parts[1]}`

  const currencies = {
    'GBP': '£',
    'USD': '$',
    'EUR': '€'
  }

  return `${currencies[currency] || ''}${amount}`
}
