import * as Debug from 'debug'
import { forEach } from 'p-iteration'

import context = require('electron-contextmenu-middleware')
import imageMenu = require('electron-image-menu')

import { Amount, Monzo, Transaction } from '../../lib/monzo'
import { getSavedCode } from '../../lib/monzo/auth'

import setTouchBar from './touchbar'
import cache, { ICacheTransaction, ICacheBank } from './cache'

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

  const accounts = await (await getMonzo()).accounts

  console.time('render cached transaction list')
  try {
    const cachedTxs = await cache.transactions.toArray()
    const txs = cachedTxs.map((tx: ICacheTransaction, index: number) => {
      return new Transaction(undefined, undefined, JSON.parse(tx.json), index)
    })

    $txList.txs = txs
    debug('cached transactions =>', $txList.txs)

    $txList.classList.remove('inactive')
    $txList.render()
  } catch (err) {
    console.error(err)
  }
  console.timeEnd('render cached transaction list')

  console.time('render cached balance')
  try {
    const cachedBank = (await cache.banks.limit(1).toArray())[0]
    const { native, local } = JSON.parse(cachedBank.balance)
    const balance = new Amount(native, local)

    $accDescription.textContent = cachedBank.name

    if (!balance.foreign) {
      $balance.innerHTML = balance.html(true, 0)
    } else {
      $balance.innerHTML =
        (balance.exchanged as Amount).html(true, 0) + balance.html(true, 0)
    }

    setTouchBar(balance)
  } catch (err) {
    console.error(err)
  }
  console.timeEnd('render cached balance')

  console.time('render HTTP transaction list')
  try {
    const txs = await accounts[0].transactions

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
    console.timeEnd('render HTTP transaction list')

    await forEach(txs, async (tx: Transaction) => {
      try {
        await cache.transactions.put({
          id: tx.id,
          accId: accounts[0].id,
          json: tx.json
        })
      } catch (err) {
        console.error(err)
      }
    })
  } catch (err) {
    console.error(err)
  }

  console.time('render HTTP balance')
  try {
    const acc = accounts[0]
    const { balance, spentToday } = await acc.balance

    await cache.banks.put({
      accId: acc.id,
      balance: balance.json,
      name: acc.name,
      type: 'Monzo'
    })

    $accDescription.textContent = acc.name

    if (!balance.foreign) {
      $balance.innerHTML = balance.html(true, 0)
      $spentToday.innerHTML = spentToday.html(true, 0)
    } else {
      $balance.innerHTML =
        (balance.exchanged as Amount).html(true, 0) + balance.html(true, 0)
      $spentToday.innerHTML =
        (spentToday.exchanged as Amount).html(true, 0) +
        spentToday.html(true, 0)
    }

    setTouchBar(balance, spentToday)
  } catch (err) {
    console.error(err)
  }
  console.timeEnd('render HTTP balance')
})
