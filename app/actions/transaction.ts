import { ActionCreator } from 'redux'

import { IAction, EActions } from './index'
import { IMonzoApiTransaction } from '../../lib/monzo'

export interface ISetTransactionsAction extends IAction {
  type: EActions.SET_TRANSACTIONS
  transactions: IMonzoApiTransaction[]
}

export const setTransactions: ActionCreator<ISetTransactionsAction> = (
  transactions: IMonzoApiTransaction[]
) => {
  return {
    type: EActions.SET_TRANSACTIONS,
    transactions
  }
}

export interface IAddTransactionAction extends IAction {
  type: EActions.ADD_TRANSACTION
  transaction: IMonzoApiTransaction
}

export const addTransaction: ActionCreator<IAddTransactionAction> = (
  transaction: IMonzoApiTransaction
) => {
  return {
    type: EActions.ADD_TRANSACTION,
    transaction
  }
}

export interface IAddTransactionsAction extends IAction {
  type: EActions.ADD_TRANSACTIONS
  transactions: IMonzoApiTransaction[]
}

export const addTransactions: ActionCreator<IAddTransactionsAction> = (
  transactions: IMonzoApiTransaction[]
) => {
  return {
    type: EActions.ADD_TRANSACTIONS,
    transactions
  }
}

export interface IUpdateTransactionsAction extends IAction {
  type: EActions.UPDATE_TRANSACTION
  transaction: IMonzoApiTransaction
}

export const updateTransaction: ActionCreator<IUpdateTransactionsAction> = (
  transaction: IMonzoApiTransaction[]
) => {
  return {
    type: EActions.UPDATE_TRANSACTION,
    transaction
  }
}
