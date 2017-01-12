'use strict'

document.addEventListener('DOMContentLoaded', () => {
  const Config = require('electron-config')
  const config = new Config()

  const context = require('electron-contextmenu-middleware')
  context.use(require('electron-image-menu'))
  context.activate()

  const Monzo = require('../lib/monzo/Monzo')

  const monzo = new Monzo(config.get('accessToken'))
  const debug = true

  Array.from(document.querySelectorAll('.fixable')).forEach(function (el) {
    window.Stickyfill.add(el)
  })

  const balances = document.querySelector('.balances')
  const tabs = document.querySelector('.tabs')
  const app = document.querySelector('.app')

  const txlist = document.querySelector('m-transaction-list')

  const accounts = monzo.accounts

  accounts
    .then(accs => accs[0].transactions)
    .then(txs => {
      if (debug) console.log(txs)

      txlist.txs = txs
      txlist.classList.remove('inactive')

      window.setTimeout(txlist.render.bind(txlist), 0)
    })

  accounts
    .then(accs => accs[0])
    .then(acc => {
      tabs.querySelector('.person').textContent = acc.description

      return acc.balance
    })
    .then(({balance, spentToday}) => {
      if (debug) console.log(balance)
      if (debug) console.log(spentToday)

      balances.querySelector('.card-balance').querySelector('h2').innerHTML = balance.html(true, 0)
      balances.querySelector('.spent-today').querySelector('h2').innerHTML = spentToday.html(true, 0)
    })
})
