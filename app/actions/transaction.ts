import { createAction } from 'redux-actions'

import { EActions } from './index'
import { IMonzoApiTransaction } from '../../lib/monzo'

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

export type IModifyTransactionsPayloads =
  | ISetTransactionsPayload
  | IAddTransactionsPayload
  | IUpdateTransactionsPayload

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
