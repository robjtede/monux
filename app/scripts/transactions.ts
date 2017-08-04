import * as Debug from 'debug'
import { map } from 'p-iteration'

import { getMonzo, Transaction } from '../../lib/monzo'

import { getCachedTransactions, updateTransactionCache } from './cache'

import {
  setTransactions,
  addTransactions,
  updateTransactions
} from '../actions'
import store from '../store'

const debug = Debug('app:scripts:transactions')

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
}

store.dispatch({
  type: 'LOAD_TRANSACTIONS',
  payload: (async () => {
    const txs = await getCachedTransactions()

    debug('cached transactions =>', txs)

    const rawtxs = txs.map(tx => tx.json)
    store.dispatch(setTransactions(rawtxs))
  })()
})

store.dispatch({
  type: 'GET_TRANSACTIONS',
  payload: (async () => {
    try {
      const account = (await (await getMonzo()).accounts)[0]

      const cachedTxs = await getCachedTransactions()

      const txs =
        cachedTxs.length > 0
          ? await account.transactions({ since: cachedTxs[0].id })
          : await account.transactions()

      debug('HTTP transactions =>', txs)

      store.dispatch(addTransactions(txs.map(tx => tx.json)))
      store.dispatch({ type: 'SET_ONLINE' })
      store.dispatch({
        type: 'SAVE_TRANSACTIONS',
        payload: updateTransactionCache(account, txs)
      })

      store.dispatch({
        type: 'GET_PENDING_TRANSACTIONS',
        payload: updatePendingTransactions()
      })
    } catch (err) {
      console.error(err)
    }
  })()
})
