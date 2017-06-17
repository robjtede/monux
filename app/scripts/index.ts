import * as path from 'path'

import { remote } from 'electron'

const { TouchBar } = remote.require('electron')
const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar

import * as Config from 'electron-config'
const config = new Config()

import context = require('electron-contextmenu-middleware')
import imageMenu = require('electron-image-menu')
context.use(imageMenu)
context.activate()

import { Monzo, Transaction } from '../../lib/monzo'

const monzo = new Monzo(config.get('accessToken'))

const debug = true

document.addEventListener('DOMContentLoaded', () => {
  const $app = document.querySelector('main') as HTMLElement
  const $header = document.querySelector('header') as HTMLElement
  const $nav = document.querySelector('nav') as HTMLElement
  const $txList = document.querySelector('m-transaction-list') as HTMLElement
  const $txDetail = document.querySelector(
    'm-transaction-detail'
  ) as HTMLElement
  const $balance = $header.querySelector(
    '.card-balance h2'
  ) as HTMLHeadingElement
  const $spentToday = $header.querySelector(
    '.spent-today h2'
  ) as HTMLHeadingElement
  const $accDescription = $nav.querySelector('.person') as HTMLDivElement

  const accounts = monzo.accounts

  const transactions = localStorage.getItem('transactions')

  if (transactions) {
    $txList.txs = JSON.parse(transactions)
      .filter((tx, index) => index > 420 && index < 425)
      .map((tx, index) => new Transaction(undefined, undefined, tx, index))

    if (debug) console.info($txList.txs)

    $txList.classList.remove('inactive')
    $txList.render()
  }

  accounts.then(accs => accs[0].transactions).then(txs => {
    if (debug) console.dir(txs)

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

  if (accDescription) $accDescription.textContent = accDescription
  if (balance) $balance.innerHTML = balance
  if (spentToday) $spentToday.innerHTML = spentToday

  const tbBalance = new TouchBarLabel({
    label: 'Balance: $--.--'
  })
  const tbSpent = new TouchBarLabel({
    label: 'Spent Today: $--.--'
  })

  const escKey = new TouchBarButton({
    icon: path.resolve(
      path.join(path.resolve('.'), 'app', 'icons', 'monzo.touchbar.png')
    ),
    label: 'Monux',
    iconPosition: 'left',
    backgroundColor: '#15233C'
  })

  const touchBar = new TouchBar({
    items: [tbBalance, new TouchBarSpacer({ size: 'large' }), tbSpent],
    escapeItem: escKey
  })
  remote.getCurrentWindow().setTouchBar(touchBar)

  accounts
    .then(accs => accs[0])
    .then(acc => {
      if (debug) console.log(acc)

      localStorage.setItem('accDescription', acc.description)
      $accDescription.textContent = localStorage.getItem('accDescription')

      return acc.balance
    })
    .then(({ balance, spentToday }) => {
      if (debug) console.info(balance)
      if (debug) console.info(spentToday)

      tbBalance.label = `Balance: ${balance.format('%y%a')}`
      tbSpent.label = `Spent Today: ${spentToday.format('%y%a')}`

      if (!balance.foreign) {
        localStorage.setItem('balance', balance.html(true, 0))
        localStorage.setItem('spentToday', spentToday.html(true, 0))
      } else {
        localStorage.setItem(
          'balance',
          balance.exchanged.html(true, 0) + '' + balance.html(true, 0)
        )
        localStorage.setItem(
          'spentToday',
          spentToday.exchanged.html(true, 0) + '' + spentToday.html(true, 0)
        )
      }

      $balance.innerHTML = localStorage.getItem('balance') as string
      $spentToday.innerHTML = localStorage.getItem('spentToday') as string
    })

  const allTabs = Array.from($nav.querySelectorAll('.tab')) as HTMLElement[]
  const allPanes = Array.from(
    $app.querySelectorAll('.app-pane')
  ) as HTMLElement[]

  allTabs.forEach((tab: HTMLElement) => {
    tab.addEventListener('click', (ev: MouseEvent) => {
      ev.stopPropagation()

      const pane = $app.querySelector(
        `.app-pane.${tab.dataset.pane}-pane`
      ) as HTMLElement

      allTabs.forEach(tab => tab.classList.remove('active'))
      allPanes.forEach(pane => pane.classList.remove('active'))

      tab.classList.add('active')
      pane.classList.add('active')
    })
  })
})
