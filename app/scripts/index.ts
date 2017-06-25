import * as Debug from 'debug'
import { forEach } from 'p-iteration'

import context = require('electron-contextmenu-middleware')
import imageMenu = require('electron-image-menu')

import { Amount, Monzo, Transaction } from '../../lib/monzo'
import { getSavedCode } from '../../lib/monzo/auth'

import setTouchBar from './touchbar'
import cache from './cache'

context.use(imageMenu)
context.activate()

const debug = Debug('app:renderer:index')

const getMonzo = (() => {
  const accessToken = getSavedCode('access_token')

  return async (): Promise<Monzo> => {
    return new Monzo(await accessToken)
  }
})()

document.addEventListener('DOMContentLoaded', async () => {
  const $app = document.querySelector('main') as HTMLElement
  const $header = document.querySelector('header') as HTMLElement
  const $nav = document.querySelector('nav') as HTMLElement
  const $txList = $app.querySelector('m-transaction-list') as HTMLElement
  const $txDetail = $app.querySelector('m-transaction-detail') as HTMLElement
  const $balance = $header.querySelector(
    '.card-balance h2'
  ) as HTMLHeadingElement
  const $spentToday = $header.querySelector(
    '.spent-today h2'
  ) as HTMLHeadingElement
  const $accDescription = $nav.querySelector('.person') as HTMLDivElement

  const accounts = (await getMonzo()).accounts

  console.time('render cached transaction list')
  // const transactions = localStorage.getItem('transactions')
  //
  // if (transactions) {
  //   $txList.txs = JSON.parse(transactions)
  //     // .filter((tx, index) => index > 420 && index < 425)
  //     .map((tx, index) => new Transaction(undefined, undefined, tx, index))
  //
  //   debug('cached transactions =>', $txList.txs)
  //
  //   $txList.classList.remove('inactive')
  //   $txList.render()
  // }

  try {
    await cache.open()

    console.log(await cache.transactions.toArray())
  } catch (err) {
    console.error(err)
  }

  console.timeEnd('render cached transaction list')

  console.time('render new transaction list')
  accounts
    .then(accs => accs[0].transactions)
    .then(async txs => {
      await forEach(txs, async (tx: Transaction) => {
        try {
          await cache.transactions.add({
            id: tx.id,
            json: tx.json
          })
        } catch (err) {}
      })

      return txs
    })
    .then(txs => {
      debug('HTTP transactions =>', txs)

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

      console.timeEnd('render new transaction list')
    })

  try {
    const acc = (await accounts)[0]
    const { balance, spentToday } = await acc.balance

    const lsBalance = localStorage.getItem('balance')
    const lsSpentToday = localStorage.getItem('spentToday')
    const accDescription = localStorage.getItem('accDescription')

    if (accDescription) $accDescription.textContent = accDescription
    if (lsBalance) $balance.innerHTML = lsBalance
    if (lsSpentToday) $spentToday.innerHTML = lsSpentToday

    localStorage.setItem('accDescription', acc.description)
    $accDescription.textContent = localStorage.getItem('accDescription')

    if (!balance.foreign) {
      localStorage.setItem('balance', balance.html(true, 0))
      localStorage.setItem('spentToday', spentToday.html(true, 0))
    } else {
      localStorage.setItem(
        'balance',
        (balance.exchanged as Amount).html(true, 0) + balance.html(true, 0)
      )
      localStorage.setItem(
        'spentToday',
        (spentToday.exchanged as Amount).html(true, 0) +
          spentToday.html(true, 0)
      )
    }

    $balance.innerHTML = localStorage.getItem('balance') as string
    $spentToday.innerHTML = localStorage.getItem('spentToday') as string

    setTouchBar(balance, spentToday)
  } catch (err) {
    console.error(err)
  }
})
