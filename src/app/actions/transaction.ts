import { createAction } from 'redux-actions'

import { EActions } from './'
// import { store } from '../store'

import { MonzoTransactionResponse } from '../../lib/monzo/Transaction'

// import { updateTransactionCache } from '../scripts/cache'

export const setTransactions = createAction<
  SetTransactionsPayload,
  MonzoTransactionResponse[]
>(EActions.SET_TRANSACTIONS, txs => ({
  txs
}))

export const addTransactions = createAction<
  AddTransactionsPayload,
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

export interface SetTransactionsPayload {
  txs: MonzoTransactionResponse[]
}

export interface AddTransactionsPayload {
  txs: MonzoTransactionResponse[]
}

export interface UpdateTransactionsPayload {
  txs: MonzoTransactionResponse[]
}

export interface SelectTransactionPayload {
  txId: string
}

export interface HideTransactionPayload {
  txId: string
}

export interface HideTransactionPromise {
  promise: Promise<any>
  data: HideTransactionPayload
}

export interface UnhideTransactionPayload {
  txId: string
}

export interface UpdateTransactionNotesPayload {
  txId: string
}

export interface UpdateTransactionNotesPromise {
  promise: Promise<{ tx: MonzoTransactionResponse }>
  data: UpdateTransactionNotesPayload
}

export interface SaveTransactionsPromise {
  promise: Promise<any>
}
