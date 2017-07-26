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

import { setBalance, ISetBalancePayload } from './balance'
export { setBalance, ISetBalancePayload }

import { setSpent, ISetSpentPayload } from './spent'
export { setSpent, ISetSpentPayload }

import { setAccount, ISetAccountPayload } from './account'
export { setAccount, ISetAccountPayload }

import { setPane } from './pane'
export { setPane }

import {
  setTransactions,
  addTransaction,
  addTransactions,
  updateTransaction,
  updateTransactions,
  selectTransaction
} from './transaction'
export {
  setTransactions,
  addTransaction,
  addTransactions,
  updateTransaction,
  updateTransactions,
  selectTransaction
}
