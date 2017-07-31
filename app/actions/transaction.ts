import { createAction } from 'redux-actions'

import { EActions } from './index'
import { store } from '../store'

import {
  Account,
  Transaction,
  getMonzo,
  IMonzoApiAccount,
  IMonzoApiTransaction
} from '../../lib/monzo'
import { updateTransactionCache } from '../scripts/cache'

export interface ISetTransactionsPayload {
  txs: IMonzoApiTransaction[]
}

export interface IAddTransactionsPayload {
  txs: IMonzoApiTransaction[]
}

export interface IUpdateTransactionsPayload {
  txs: IMonzoApiTransaction[]
}

export interface ISelectTransactionPayload {
  txId: string
}

export interface IHideTransactionPayload {
  txId: string
}

export interface IHideTransactionPromise {
  promise: Promise<any>
  data: IHideTransactionPayload
}

export interface IUnhideTransactionPayload {
  txId: string
}

export const setTransactions = createAction<
  ISetTransactionsPayload,
  IMonzoApiTransaction[]
>(EActions.SET_TRANSACTIONS, txs => ({
  txs
}))

export const addTransactions = createAction<
  IAddTransactionsPayload,
  IMonzoApiTransaction[]
>(EActions.ADD_TRANSACTIONS, txs => ({
  txs
}))

export const updateTransactions = createAction<
  IUpdateTransactionsPayload,
  IMonzoApiTransaction[]
>(EActions.UPDATE_TRANSACTIONS, txs => ({
  txs
}))

export const selectTransaction = createAction<
  ISelectTransactionPayload,
  string
>(EActions.SELECT_TRANSACTION, txId => ({
  txId
}))

export const hideTransaction = createAction<
  IHideTransactionPromise,
  Transaction,
  IMonzoApiAccount
>(EActions.HIDE_TRANSACTION, (tx, acc) => ({
  promise: (async () => {
    const monzo = await getMonzo()
    const account = new Account(monzo, acc)

    tx.monzo = monzo
    tx.acc = account

    const txHidden = await tx.annotate('monux_hidden', 'true')
    store.dispatch(updateTransactions([txHidden.transaction]))
    store.dispatch({
      type: 'SAVE_TRANSACTIONS',
      payload: updateTransactionCache(account, [
        new Transaction(undefined, undefined, txHidden.transaction)
      ])
    })

    return txHidden
  })(),
  data: { txId: tx.id }
}))

export const unhideTransaction = createAction<
  IUnhideTransactionPayload,
  string
>(EActions.UNHIDE_TRANSACTION, txId => ({
  txId
}))
