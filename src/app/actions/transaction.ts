import Debug = require('debug')

import { Injectable } from '@angular/core'
import { NgRedux } from '@angular-redux/store'
import { createAction } from 'redux-actions'

import { MonzoService } from '../services/monzo.service'
import { CacheService } from '../services/cache.service'

import { AppState } from '../store'

import Account, {
  accountsRequest,
  MonzoAccountsResponse
} from '../../lib/monzo/Account'
import Transaction, {
  MonzoTransactionResponse,
  TransactionRequestOpts
} from '../../lib/monzo/Transaction'

const debug = Debug('app:actions:transaction')

@Injectable()
export class TransactionActions {
  static readonly LOAD_TRANSACTIONS = 'LOAD_TRANSACTIONS'
  static readonly SAVE_TRANSACTIONS = 'SAVE_TRANSACTIONS'
  static readonly SET_TRANSACTIONS = 'SET_TRANSACTIONS'
  static readonly ADD_TRANSACTIONS = 'ADD_TRANSACTIONS'
  static readonly GET_TRANSACTIONS = 'GET_TRANSACTIONS'
  static readonly GET_PENDING_TRANSACTIONS = 'GET_PENDING_TRANSACTIONS'
  static readonly GET_NEW_TRANSACTIONS = 'GET_NEW_TRANSACTIONS'
  static readonly UPDATE_TRANSACTIONS = 'UPDATE_TRANSACTIONS'
  static readonly POST_TRANSACTION = 'POST_TRANSACTION'
  static readonly SELECT_TRANSACTION = 'SELECT_TRANSACTION'
  static readonly HIDE_TRANSACTION = 'HIDE_TRANSACTION'
  static readonly UNHIDE_TRANSACTION = 'UNHIDE_TRANSACTION'
  static readonly UPDATE_TRANSACTION_NOTES = 'UPDATE_TRANSACTION_NOTES'

  constructor(
    private readonly redux: NgRedux<AppState>,
    private readonly monzo: MonzoService,
    private readonly cache: CacheService
  ) {}

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

  getTransactions(options: TransactionRequestOpts = {}) {
    return createAction<
      GetTransactionsPromise
    >(TransactionActions.GET_TRANSACTIONS, () => ({
      promise: (async () => {
        // TODO: duplicate request
        const acc = new Account(
          (await this.monzo.request<MonzoAccountsResponse>(accountsRequest()))
            .accounts[0]
        )

        const { transactions: txs } = await this.monzo.request<{
          transactions: MonzoTransactionResponse[]
        }>(acc.transactionsRequest(options))

        debug('HTTP transactions =>', txs)

        this.redux.dispatch(this.updateTransactions(txs))
        this.redux.dispatch(
          // TODO: wasted class instantiation
          this.saveTransactions(acc, txs.map(tx => new Transaction(tx)))
        )
      })()
    }))()
  }

  getTransaction(txId: string) {
    return createAction<
      GetTransactionsPromise
    >(TransactionActions.GET_TRANSACTIONS, () => ({
      promise: (async () => {
        // TODO: duplicate request
        const acc = new Account(
          (await this.monzo.request<MonzoAccountsResponse>(accountsRequest()))
            .accounts[0]
        )

        const { transaction: tx } = await this.monzo.request<{
          transaction: MonzoTransactionResponse
        }>(acc.transactionRequest(txId))

        debug('HTTP pending transaction =>', tx)

        // BUG: adds pending txs to tx list
        // this.redux.dispatch(this.updateTransactions([tx]))
        this.redux.dispatch(
          // TODO: wasted class instantiation
          this.saveTransactions(acc, [new Transaction(tx)])
        )
      })()
    }))()
  }

  getNewTransactions() {
    return createAction<
      GetTransactionsPromise
    >(TransactionActions.GET_NEW_TRANSACTIONS, () => ({
      promise: (async () => {
        const recentTx = (await this.cache.loadTransactions({ limit: 1 }))[0]

        const action = recentTx
          ? this.getTransactions({ since: recentTx.id })
          : this.getTransactions()

        this.redux.dispatch(action)
      })()
    }))()
  }

  getPendingTransactions() {
    return createAction<
      GetTransactionsPromise
    >(TransactionActions.GET_PENDING_TRANSACTIONS, () => ({
      promise: (async () => {
        const txs = (await this.cache.loadTransactions()).filter(tx => {
          // TODO: wasted class instantiation
          return new Transaction(tx).pending
        })

        txs.forEach(tx => this.redux.dispatch(this.getTransaction(tx.id)))
      })()
    }))()
  }

  loadTransactions(opts: TransactionRequestOpts = {}) {
    return createAction<
      LoadTransactionsPromise
    >(TransactionActions.LOAD_TRANSACTIONS, () => ({
      promise: (async () => {
        const txs = await this.cache.loadTransactions(opts)

        debug('cached transactions =>', txs)

        this.redux.dispatch(this.setTransactions(txs))
      })()
    }))()
  }

  saveTransactions(account: Account, txs: Transaction[]) {
    return createAction<
      SaveTransactionsPromise,
      Account,
      Transaction[]
    >(TransactionActions.SAVE_TRANSACTIONS, (acc, txs) => ({
      promise: this.cache.saveTransactions(acc, txs)
    }))(account, txs)
  }

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

export interface GetTransactionsPromise {
  promise: Promise<any>
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

export interface LoadTransactionsPromise {
  promise: Promise<any>
}
