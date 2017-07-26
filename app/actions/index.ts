export enum EActions {
  SET_SPENT = 'SET_SPENT',
  SET_BALANCE = 'SET_BALANCE',
  SET_ACCOUNT = 'SET_ACCOUNT',
  SET_PANE = 'SET_PANE',
  SET_TRANSACTIONS = 'SET_TRANSACTIONS',
  ADD_TRANSACTIONS = 'ADD_TRANSACTIONS',
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
  ISetTransactionsPayload,
  addTransactions,
  IAddTransactionsPayload,
  updateTransactions,
  IUpdateTransactionsPayload,
  selectTransaction,
  ISelectTransactionPayload,
  IModifyTransactionsPayloads
} from './transaction'
export {
  setTransactions,
  ISetTransactionsPayload,
  addTransactions,
  IAddTransactionsPayload,
  updateTransactions,
  IUpdateTransactionsPayload,
  selectTransaction,
  ISelectTransactionPayload,
  IModifyTransactionsPayloads
}
