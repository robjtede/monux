import * as Debug from 'debug'
import { map } from 'p-iteration'

import { getMonzo, Transaction } from '../../lib/monzo'

import db, { getCachedTransactions, updateTransactionCache } from './cache'

import {
  setTransactions,
  addTransactions,
  updateTransactions
} from '../actions'
import store from '../store'

const debug = Debug('app:renderer:transactions')

document.addEventListener('DOMContentLoaded', async () => {
  const $app = document.querySelector('main') as HTMLElement
  const $txList = $app.querySelector('m-transaction-list') as HTMLElement
  const $txDetail = $app.querySelector('m-transaction-detail') as HTMLElement

  const renderCachedTransactions = async () => {
    console.time('render cached transaction list')
    const txs = await getCachedTransactions()
    debug('cached transactions =>', txs)

    const rawtxs = txs.map(tx => tx.json)
    store.dispatch(setTransactions(rawtxs))

    // renderTransactions(txs)
    console.timeEnd('render cached transaction list')
  }

  const renderHTTPTransactions = async () => {
    console.time('render HTTP transaction list')
    try {
      const account = (await (await getMonzo()).accounts)[0]

      const cachedTxs = await getCachedTransactions()

      const txs =
        cachedTxs.length > 0
          ? await account.transactions({ since: cachedTxs[0].id })
          : await account.transactions()

      debug('HTTP transactions =>', txs)

      store.dispatch(addTransactions(txs.map(tx => tx.json)))

      // TODO: remove
      // apply new online objects to existing txs
      $txList.txs.forEach(($tx: Transaction) => {
        $tx.monzo = account.monzo
        $tx.acc = account
      })

      $txDetail.removeAttribute('offline')

      console.timeEnd('render HTTP transaction list')

      updateTransactionCache(account, txs)
    } catch (err) {
      console.error(err)
    }
  }

  const updatePendingTransactions = async () => {
    const monzo = await getMonzo()
    const acc = (await monzo.accounts)[0]

    const toUpdate = store
      .getState()
      .transactions.map(tx => {
        return new Transaction(monzo, acc, tx)
      })
      .filter(tx => {
        return tx.pending
      })

    const updatedTxs: Transaction[] = await map(
      toUpdate,
      async (tx: Transaction) => {
        try {
          return await acc.transaction(tx.id)
        } catch (err) {
          console.error(err)
          throw new Error(err)
        }
      }
    )

    store.dispatch(updateTransactions(updatedTxs.map(tx => tx.json)))
    updateTransactionCache(acc, updatedTxs)
  }

  // await Promise.all([renderCachedTransactions(), renderHTTPTransactions()])
  // updatePendingTransactions()
})
