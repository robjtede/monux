'use strict'

const Config = require('electron-config')
const config = new Config()

const Monzo = require('../lib/monzo/Monzo')

const monzo = new Monzo(config.get('accessToken'))
const debug = true

document.addEventListener('DOMContentLoaded', () => {
  Array.from(document.querySelectorAll('.fixable')).forEach(function (el) {
    window.Stickyfill.add(el)
  })

  const app = document.querySelector('.app')

  const txlist = document.querySelector('m-transaction-list')

  const accounts = monzo.accounts

  accounts
    .then(accs => accs[0].transactions)
    .then(txs => {
      if (debug) console.log(txs)

      txlist.txs = txs
      txlist.render()
      txlist.classList.remove('inactive')
    })

  accounts
    .then(accs => accs[0].balance)
    .then(({balance, spentToday}) => {
      if (debug) console.log(balance)
      if (debug) console.log(spentToday)

      document.querySelector('.card-balance').querySelector('h2').innerHTML = balance.html(true, 0)
      document.querySelector('.spent-today').querySelector('h2').innerHTML = spentToday.html(true, 0)
    })
})
