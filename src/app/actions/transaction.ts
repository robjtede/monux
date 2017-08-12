import { Injectable } from '@angular/core'
import { createAction } from 'redux-actions'

// import { store } from '../store'

import Account from '../../lib/monzo/Account'
import Transaction, {
  MonzoTransactionResponse
} from '../../lib/monzo/Transaction'

// import { updateTransactionCache } from '../scripts/cache'

@Injectable()
export class TransactionActions {
  static readonly LOAD_TRANSACTIONS = 'LOAD_TRANSACTIONS'
  static readonly SAVE_TRANSACTIONS = 'SAVE_TRANSACTIONS'
  static readonly SET_TRANSACTIONS = 'SET_TRANSACTIONS'
  static readonly ADD_TRANSACTIONS = 'ADD_TRANSACTIONS'
  static readonly UPDATE_TRANSACTIONS = 'UPDATE_TRANSACTIONS'
  static readonly POST_TRANSACTION = 'POST_TRANSACTION'
  static readonly SELECT_TRANSACTION = 'SELECT_TRANSACTION'
  static readonly HIDE_TRANSACTION = 'HIDE_TRANSACTION'
  static readonly UNHIDE_TRANSACTION = 'UNHIDE_TRANSACTION'
  static readonly UPDATE_TRANSACTION_NOTES = 'UPDATE_TRANSACTION_NOTES'

  setTransactions(txs: MonzoTransactionResponse[]) {
    return createAction<
      SetTransactionsPayload,
      MonzoTransactionResponse[]
    >(TransactionActions.SET_TRANSACTIONS, txs => ({
      txs
    }))(txs)
  }

  addTransactions(txs: MonzoTransactionResponse[]) {
    return createAction<
      AddTransactionsPayload,
      MonzoTransactionResponse[]
    >(TransactionActions.ADD_TRANSACTIONS, txs => ({
      txs
    }))(txs)
  }

  updateTransactions(txs: MonzoTransactionResponse[]) {
    return createAction<
      UpdateTransactionsPayload,
      MonzoTransactionResponse[]
    >(TransactionActions.UPDATE_TRANSACTIONS, txs => ({
      txs
    }))(txs)
  }

  selectTransaction(txId: string) {
    return createAction<
      SelectTransactionPayload,
      string
    >(TransactionActions.SELECT_TRANSACTION, txId => ({
      txId
    }))(txId)
  }

  // saveTransactions(account: Account, txs: Transaction[]) {
  //   return createAction<
  //     SaveTransactionsPromise,
  //     Account,
  //     Transaction[]
  //   >(TransactionActions.SAVE_TRANSACTIONS, (acc, txs) => ({
  //     promise: updateTransactionCache(acc, txs)
  //   }))(account, txs)
  // }

  // export const hideTransaction = createAction<
  //   HideTransactionPromise,
  //   Transaction,
  //   MonzoApiAccount
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
  //   UnhideTransactionPromise,
  //   Transaction,
  //   MonzoApiAccount
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
}

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
  promise: Promise<{ tx: MonzoTransactionResponse }>
  data: HideTransactionPayload
}

export interface UnhideTransactionPayload {
  txId: string
}

export interface HideTransactionPromise {
  promise: Promise<{ tx: MonzoTransactionResponse }>
  data: UnhideTransactionPayload
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
