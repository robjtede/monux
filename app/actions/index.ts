import { Action } from 'redux'

export enum EActions {
  SET_SPENT = 'SET_SPENT',
  SET_BALANCE = 'SET_BALANCE',
  SET_ACCOUNT = 'SET_ACCOUNT',
  SET_PANE = 'SET_PANE',
  SET_TRANSACTIONS = 'SET_TRANSACTIONS',
  ADD_TRANSACTION = 'ADD_TRANSACTION',
  ADD_TRANSACTIONS = 'ADD_TRANSACTIONS',
  UPDATE_TRANSACTION = 'UPDATE_TRANSACTION',
  UPDATE_TRANSACTIONS = 'UPDATE_TRANSACTIONS',
  SELECT_TRANSACTION = 'SELECT_TRANSACTION'
}

export interface IAction extends Action {
  type: EActions
}

import { setBalance, ISetBalanceAction } from './balance'
export { setBalance, ISetBalanceAction }

import { setSpent, ISetSpentAction } from './spent'
export { setSpent, ISetSpentAction }

import { setAccount, ISetAccountAction } from './account'
export { setAccount, ISetAccountAction }

import { setPane, ISetPaneAction } from './pane'
export { setPane, ISetPaneAction }

import {
  setTransactions,
  ISetTransactionsAction,
  addTransaction,
  IAddTransactionAction,
  addTransactions,
  IAddTransactionsAction,
  updateTransaction,
  IUpdateTransactionAction,
  updateTransactions,
  IUpdateTransactionsAction,
  selectTransaction,
  ISelectTransactionAction
} from './transaction'
export {
  setTransactions,
  ISetTransactionsAction,
  addTransaction,
  IAddTransactionAction,
  addTransactions,
  IAddTransactionsAction,
  updateTransaction,
  IUpdateTransactionAction,
  updateTransactions,
  IUpdateTransactionsAction,
  selectTransaction,
  ISelectTransactionAction
}
