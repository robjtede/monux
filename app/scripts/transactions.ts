import * as Debug from 'debug'
import { forEach, map } from 'p-iteration'

import { Account, Monzo, Transaction } from '../../lib/monzo'
import { getSavedCode } from '../../lib/monzo/auth'

import db, { ICacheTransaction, ICacheAccount } from './cache'

import {
  setTransactions,
  addTransactions,
  updateTransactions
} from '../actions'
import store from '../store'

const debug = Debug('app:renderer:transactions')

const getMonzo = (() => {
  const accessToken = getSavedCode('access_token')

  return async (): Promise<Monzo> => {
    return new Monzo(await accessToken)
  }
})()

export const getCachedAccount = (() => {
  const cachedAccount = db.accounts.limit(1).toArray()

  return async (): Promise<ICacheAccount> => {
    return (await cachedAccount)[0]
  }
})()

export const getCachedTransactions = (() => {
  const cachedTxs = db.transactions.toArray()

  return async (): Promise<Transaction[]> => {
    try {
      return (await cachedTxs).map((tx: ICacheTransaction, index: number) => {
        return new Transaction(undefined, undefined, JSON.parse(tx.json), index)
      })
    } catch (err) {
      console.error(err)
      throw new Error(err)
    }
  }
})()

const updateTransactionCache = async (acc: Account, tx: Transaction) => {
  try {
    await db.transactions.put({
      id: tx.id,
      created_at: tx.created,
      accId: acc.id,
      json: tx.stringify
    })
  } catch (err) {
    console.error(err)
  }
}

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

      // TODO: Table#orderBy
      const cachedTxs = await db.transactions.reverse().sortBy('created_at')
      const anyCached = cachedTxs.length > 0

      const txs = anyCached
        ? await account.transactions({ since: cachedTxs[0].id })
        : await account.transactions()

      debug('HTTP transactions =>', txs)

      const rawtxs = txs.map(tx => tx.json)
      store.dispatch(addTransactions(rawtxs))

      // apply new online objects to existing txs
      $txList.txs.forEach(($tx: Transaction) => {
        $tx.monzo = account.monzo
        $tx.acc = account
      })

      $txDetail.removeAttribute('offline')

      console.timeEnd('render HTTP transaction list')

      // TODO: bulkPut
      await forEach(txs, async (tx: Transaction) => {
        updateTransactionCache(account, tx)
      })
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

    // TODO: dispatch updateTransactions
    // TODO: also check equivilancy in reducer

    const updatedTxs = await map(toUpdate, async (tx: Transaction) => {
      try {
        const updatedTx = await acc.transaction(tx.id)

        updateTransactionCache(acc, updatedTx)
        debug('updated cached txs', tx.id)

        return updatedTx
      } catch (err) {
        console.error(err)
        return
      }
    })

    store.dispatch(
      updateTransactions(updatedTxs.map((tx: Transaction) => tx.json))
    )
  }

  await Promise.all([renderCachedTransactions(), renderHTTPTransactions()])
  updatePendingTransactions()
})
