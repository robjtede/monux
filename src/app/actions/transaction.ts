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
      GetTransactionsPromise,
      TransactionRequestOpts
    >(TransactionActions.GET_TRANSACTIONS, options => ({
      promise: (async () => {
        try {
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
        } catch (err) {
          throw new Error(err)
        }
      })()
    }))(options)
  }

  getTransaction(txId: string) {
    return createAction<
      GetTransactionsPromise,
      string
    >(TransactionActions.GET_TRANSACTIONS, txId => ({
      promise: (async () => {
        try {
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
        } catch (err) {
          throw new Error(err)
        }
      })()
    }))(txId)
  }

  getNewTransactions() {
    return createAction<
      GetTransactionsPromise
    >(TransactionActions.GET_NEW_TRANSACTIONS, () => ({
      promise: (async () => {
        try {
          const recentTx = (await this.cache.loadTransactions({ limit: 1 }))[0]

          const action = recentTx
            ? this.getTransactions({ since: recentTx.id })
            : this.getTransactions()

          this.redux.dispatch(action)
        } catch (err) {
          throw new Error(err)
        }
      })()
    }))()
  }

  getPendingTransactions() {
    return createAction<
      GetTransactionsPromise
    >(TransactionActions.GET_PENDING_TRANSACTIONS, () => ({
      promise: (async () => {
        try {
          const txs = (await this.cache.loadTransactions()).filter(tx => {
            // TODO: wasted class instantiation
            return new Transaction(tx).pending
          })

          txs.forEach(tx => this.redux.dispatch(this.getTransaction(tx.id)))
        } catch (err) {
          throw new Error(err)
        }
      })()
    }))()
  }

  loadTransactions(opts: TransactionRequestOpts = {}) {
    return createAction<
      LoadTransactionsPromise,
      TransactionRequestOpts
    >(TransactionActions.LOAD_TRANSACTIONS, opts => ({
      promise: (async () => {
        const txs = await this.cache.loadTransactions(opts)

        debug('cached transactions =>', txs)

        this.redux.dispatch(this.setTransactions(txs))
      })()
    }))(opts)
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

  hideTransaction(tx: Transaction) {
    return createAction<
      HideTransactionPromise,
      Transaction
    >(TransactionActions.HIDE_TRANSACTION, tx => ({
      promise: (async () => {
        try {
          const { transaction: newTx } = await this.monzo.request<{
            transaction: MonzoTransactionResponse
          }>(tx.annotateRequest('monux_hidden', 'true'))

          return { tx: newTx }
        } catch (err) {
          throw new Error(err)
        }
      })()
    }))(tx)
  }

  unhideTransaction(tx: Transaction) {
    return createAction<
      HideTransactionPromise,
      Transaction
    >(TransactionActions.HIDE_TRANSACTION, tx => ({
      promise: (async () => {
        try {
          const { transaction: newTx } = await this.monzo.request<{
            transaction: MonzoTransactionResponse
          }>(tx.annotateRequest('monux_hidden', ''))

          return { tx: newTx }
        } catch (err) {
          throw new Error(err)
        }
      })()
    }))(tx)
  }

  updateTransactionNotes(tx: Transaction, notes: string) {
    return createAction<
      UpdateTransactionNotesPromise,
      Transaction,
      string
    >(TransactionActions.UPDATE_TRANSACTION_NOTES, (tx, notes) => ({
      promise: (async () => {
        // TODO: duplicate request
        const acc = new Account(
          (await this.monzo.request<MonzoAccountsResponse>(accountsRequest()))
            .accounts[0]
        )

        await this.monzo.request<{
          transaction: MonzoTransactionResponse
        }>(await tx.setNotesRequest(notes))

        const { transaction: newTx } = await this.monzo.request<{
          transaction: MonzoTransactionResponse
        }>(await acc.transactionRequest(tx.id))

        this.redux.dispatch(this.updateTransactions([newTx]))
        this.redux.dispatch(
          this.saveTransactions(acc, [new Transaction(newTx)])
        )

        return { tx: newTx }
      })()
    }))(tx, notes)
  }
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
  promise: Promise<void>
}

export interface HideTransactionPromise {
  promise: Promise<{ tx: MonzoTransactionResponse }>
}

export interface UnhideTransactionPayload {
  txId: string
}

export interface UpdateTransactionNotesPayload {
  txId: string
}

export interface UpdateTransactionNotesPromise {
  promise: Promise<{ tx: MonzoTransactionResponse }>
}

export interface SaveTransactionsPromise {
  promise: Promise<void>
}

export interface LoadTransactionsPromise {
  promise: Promise<void>
}
