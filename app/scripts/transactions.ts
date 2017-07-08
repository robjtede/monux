import * as Debug from 'debug'
import { forEach } from 'p-iteration'

import { Monzo, Transaction } from '../../lib/monzo'
import { getSavedCode } from '../../lib/monzo/auth'

import cache, { ICacheTransaction, ICacheBank } from './cache'

const debug = Debug('app:renderer:index')

const getMonzo = (() => {
  const accessToken = getSavedCode('access_token')

  return async (): Promise<Monzo> => {
    return new Monzo(await accessToken)
  }
})()

document.addEventListener('DOMContentLoaded', async () => {
  const $app = document.querySelector('main') as HTMLElement
  const $txList = $app.querySelector('m-transaction-list') as HTMLElement
  const $txDetail = $app.querySelector('m-transaction-detail') as HTMLElement

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

  console.time('render HTTP transaction list')
  try {
    // TODO: Table#orderBy
    const cachedTxs = await cache.transactions.reverse().sortBy('created_at')
    const anyCached = cachedTxs.length > 0

    const txs = anyCached
      ? await accounts[0].transactions({ since: cachedTxs[0].id })
      : await accounts[0].transactions()

    debug('HTTP transactions =>', txs)

    $txList.txs.forEach(($tx: Transaction) => {
      $tx.monzo = accounts[0].monzo
      $tx.acc = accounts[0]
    })

    Array.prototype.push.apply($txList.txs, txs)
    $txList.classList.remove('inactive')
    $txList.render()

    $txDetail.removeAttribute('offline')

    const $selectedTx = $txList.selectedTransaction

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

    // TODO: bulkPut
    await forEach(txs, async (tx: Transaction) => {
      try {
        await cache.transactions.put({
          id: tx.id,
          created_at: tx.created,
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
})
