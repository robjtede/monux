import { createAction } from 'redux-actions'

import { EActions } from './index'
// import { store } from '../store'

import { MonzoTransactionResponse } from '../../lib/monzo/Transaction'

// import { updateTransactionCache } from '../scripts/cache'

export const setTransactions = createAction<
  ISetTransactionsPayload,
  MonzoTransactionResponse[]
>(EActions.SET_TRANSACTIONS, txs => ({
  txs
}))

export const addTransactions = createAction<
  IAddTransactionsPayload,
  MonzoTransactionResponse[]
>(EActions.ADD_TRANSACTIONS, txs => ({
  txs
}))

export const updateTransactions = createAction<
  IUpdateTransactionsPayload,
  MonzoTransactionResponse[]
>(EActions.UPDATE_TRANSACTIONS, txs => ({
  txs
}))

// export const saveTransactions = createAction<
//   ISaveTransactionsPromise,
//   Account,
//   Transaction[]
// >(EActions.SAVE_TRANSACTIONS, (acc, txs) => ({
//   promise: updateTransactionCache(acc, txs)
// }))

export const selectTransaction = createAction<
  ISelectTransactionPayload,
  string
>(EActions.SELECT_TRANSACTION, txId => ({
  txId
}))

// export const hideTransaction = createAction<
//   IHideTransactionPromise,
//   Transaction,
//   IMonzoApiAccount
// >(EActions.HIDE_TRANSACTION, (tx, acc) => ({
//   promise: (async () => {
//     const monzo = await getMonzo()
//     const account = new Account(monzo, acc)
//     const ttx = new Transaction(monzo, account, tx.json)
//
//     const txHidden = await ttx.annotate('monux_hidden', 'true')
//     store.dispatch(updateTransactions([txHidden.transaction]))
//     store.dispatch(saveTransactions(account, [txHidden.transaction]))
//
//     return { tx: txHidden.transaction }
//   })(),
//   data: { txId: tx.id }
// }))

// export const unhideTransaction = createAction<
//   IHideTransactionPromise,
//   Transaction,
//   IMonzoApiAccount
// >(EActions.UNHIDE_TRANSACTION, (tx, acc) => ({
//   promise: (async () => {
//     const monzo = await getMonzo()
//     const account = new Account(monzo, acc)
//     const ttx = new Transaction(monzo, account, tx.json)
//
//     const txHidden = await ttx.annotate('monux_hidden', '')
//     store.dispatch(updateTransactions([txHidden.transaction]))
//     store.dispatch(saveTransactions(account, [txHidden.transaction]))
//
//     return { tx: txHidden.transaction }
//   })(),
//   data: { txId: tx.id }
// }))

// export const updateTransactionNotes = createAction<
//   IUpdateTransactionNotesPromise,
//   Transaction,
//   IMonzoApiAccount,
//   string
// >(EActions.UPDATE_TRANSACTION_NOTES, (tx, acc, notes) => ({
//   promise: (async () => {
//     const monzo = await getMonzo()
//     const account = new Account(monzo, acc)
//     const ttx = new Transaction(monzo, account, tx.json)
//
//     await ttx.setNotes(notes)
//     store.dispatch(updateTransactions([ttx.json]))
//     store.dispatch(saveTransactions(account, [ttx]))
//
//     return { tx: ttx.json }
//   })(),
//   data: { txId: tx.id }
// }))

export interface ISetTransactionsPayload {
  txs: MonzoTransactionResponse[]
}

export interface IAddTransactionsPayload {
  txs: MonzoTransactionResponse[]
}

export interface IUpdateTransactionsPayload {
  txs: MonzoTransactionResponse[]
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

export interface IUpdateTransactionNotesPayload {
  txId: string
}

export interface IUpdateTransactionNotesPromise {
  promise: Promise<{ tx: MonzoTransactionResponse }>
  data: IUpdateTransactionNotesPayload
}

export interface ISaveTransactionsPromise {
  promise: Promise<any>
}
