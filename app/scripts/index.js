'use strict'

document.addEventListener('DOMContentLoaded', () => {
  const Config = require('electron-config')
  const config = new Config()

  const context = require('electron-contextmenu-middleware')
  context.use(require('electron-image-menu'))
  context.activate()

  const Monzo = require('../lib/monzo/Monzo')
  const Transaction = require('../lib/monzo/Transaction')
  // const monzo = new MonzoService(new Monzo(config.get('accessToken')))
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

  const transactions = localStorage.getItem('transactions')

  if (transactions) {
    txlist.txs = JSON.parse(transactions)
      .map((tx, index) => {
        tx = new Transaction(this.monzo, this, tx, index)

        return tx
      })

    txlist.classList.remove('inactive')

    window.setTimeout(txlist.render.bind(txlist), 0)
  }

  accounts
    .then(accs => accs[0].transactions)
    .then(txs => {
      if (debug) console.log(txs)

      txlist.txs = txs
      txlist.classList.remove('inactive')

      window.setTimeout(txlist.render.bind(txlist), 0)
    })

  const balance = localStorage.getItem('balance')
  const spentToday = localStorage.getItem('spentToday')
  const accDescription = localStorage.getItem('accDescription')

  if (accDescription) {
    tabs.querySelector('.person').textContent = accDescription
  }

  if (balance) {
    balances.querySelector('.card-balance').querySelector('h2').innerHTML = balance
  }

  if (spentToday) {
    balances.querySelector('.spent-today').querySelector('h2').innerHTML = spentToday
  }

  accounts
    .then(accs => accs[0])
    .then(acc => {
      localStorage.setItem('accDescription', acc.description)

      tabs.querySelector('.person').textContent = localStorage.getItem('accDescription')

      return acc.balance
    })
    .then(({balance, spentToday}) => {
      if (debug) console.log(balance)
      if (debug) console.log(spentToday)

      localStorage.setItem('balance', balance.html(true, 0))
      localStorage.setItem('spentToday', spentToday.html(true, 0))

      balances.querySelector('.card-balance').querySelector('h2').innerHTML = localStorage.getItem('balance')
      balances.querySelector('.spent-today').querySelector('h2').innerHTML = localStorage.getItem('spentToday')
    })

  const allTabs = Array.from(tabs.querySelectorAll('.tab'))
  const allPanes = Array.from(app.querySelectorAll('.app-pane'))

  allTabs.forEach(tab => {
    tab.addEventListener('click', ev => {
      event.stopPropagation()

      const pane = app.querySelector(`.app-pane.${tab.dataset.pane}-pane`)

      allTabs.forEach(tab => tab.classList.remove('active'))
      allPanes.forEach(pane => pane.classList.remove('active'))

      tab.classList.add('active')
      pane.classList.add('active')
    })
  })
})
