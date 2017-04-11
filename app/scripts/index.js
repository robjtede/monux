'use strict'

document.addEventListener('DOMContentLoaded', () => {
  const Config = require('electron-config')
  const config = new Config()
  const path = require('path')
  const {
    remote,
    nativeImage
  } = require('electron')

  const { TouchBar } = remote.require('electron')
  const {
    TouchBarLabel,
    TouchBarButton,
    TouchBarSpacer
  } = TouchBar

  const context = require('electron-contextmenu-middleware')
  context.use(require('electron-image-menu'))
  context.activate()

  const Monzo = require('../lib/monzo/Monzo')
  const Transaction = require('../lib/monzo/Transaction')
  // const monzo = new MonzoService(new Monzo(config.get('accessToken')))
  const monzo = new Monzo(config.get('accessToken'))

  const debug = true

  const $app = document.querySelector('main')
  const $header = document.querySelector('header')
  const $nav = document.querySelector('nav')
  const $txList = document.querySelector('m-transaction-list')
  const $txDetail = document.querySelector('m-transaction-detail')

  const accounts = monzo.accounts

  const transactions = localStorage.getItem('transactions')

  if (transactions) {
    $txList.txs = JSON.parse(transactions)
      .map((tx, index) => {
        tx = new Transaction(this.monzo, this, tx, index)

        return tx
      })

    if (debug) console.log($txList.txs)

    $txList.classList.remove('inactive')
    $txList.render()
  }

  accounts
    .then(accs => accs[0].transactions)
    .then(txs => {
      if (debug) console.log(txs)

      const $selectedTx = $txList.selectedTransaction

      $txList.txs = txs
      $txList.classList.remove('inactive')
      $txList.render()

      $txDetail.removeAttribute('offline')

      if ($selectedTx) {
        const $tx = $txList.getTransactionByIndex($selectedTx.index)
        $tx.classList.add('selected')
        $tx.render()

        $txDetail.$summary = $tx
        $txDetail.tx = $tx.tx
        $txDetail.dataset.category = $tx.tx.category
        $txDetail.render()
      }
    })

  const balance = localStorage.getItem('balance')
  const spentToday = localStorage.getItem('spentToday')
  const accDescription = localStorage.getItem('accDescription')

  const tbBalance = new TouchBarLabel({
    label: 'Balance: £--.--'
  })
  const tbSpent = new TouchBarLabel({
    label: 'Spent Today: £--.--'
  })

  const monzoIcon = nativeImage.createFromPath(path.resolve('./app/icons/monzo.png'))
  console.log(monzoIcon)

  const escKey = new TouchBarButton({
    icon: path.resolve('./app/icons/monzo.touchbar.png'),
    label: 'Monzo',
    backgroundColor: '#15233C'
  })
  console.log(escKey)

  const touchBar = new TouchBar({
    items: [
      tbBalance,
      new TouchBarSpacer({ size: 'large' }),
      tbSpent
    ],
    escapeItem: escKey
  })
  remote.getCurrentWindow().setTouchBar(touchBar)

  if (accDescription) {
    $nav.querySelector('.person').textContent = accDescription
  }

  if (balance) {
    $header.querySelector('.card-balance h2').innerHTML = balance
  }

  if (spentToday) {
    $header.querySelector('.spent-today h2').innerHTML = spentToday
  }

  accounts
    .then(accs => accs[0])
    .then(acc => {
      localStorage.setItem('accDescription', acc.description)

      $nav.querySelector('.person').textContent = localStorage.getItem('accDescription')

      return acc.balance
    })
    .then(({balance, spentToday}) => {
      if (debug) console.log(balance)
      if (debug) console.log(spentToday)

      tbBalance.label = `Balance: ${balance.format('%y%a')}`
      tbSpent.label = `Spent Today: ${spentToday.format('%y%a')}`

      localStorage.setItem('balance', balance.html(true, 0))
      if (balance.local) localStorage.setItem('balance', balance.local.html(true, 0) + ' ' + balance.html(true, 0))

      localStorage.setItem('spentToday', spentToday.html(true, 0))
      if (balance.local) localStorage.setItem('spentToday', spentToday.local.html(true, 0) + ' ' + spentToday.html(true, 0))

      $header.querySelector('.card-balance h2').innerHTML = localStorage.getItem('balance')
      $header.querySelector('.spent-today h2').innerHTML = localStorage.getItem('spentToday')
    })

  const allTabs = Array.from($nav.querySelectorAll('.tab'))
  const allPanes = Array.from($app.querySelectorAll('.app-pane'))

  allTabs.forEach(tab => {
    tab.addEventListener('click', ev => {
      event.stopPropagation()

      const pane = $app.querySelector(`.app-pane.${tab.dataset.pane}-pane`)

      allTabs.forEach(tab => tab.classList.remove('active'))
      allPanes.forEach(pane => pane.classList.remove('active'))

      tab.classList.add('active')
      pane.classList.add('active')
    })
  })
})
