import { Action } from '@ngrx/store'

import { suffixes } from './'

import {
  MonzoTransactionResponse,
  TransactionRequestOpts
} from '../../../lib/monzo/Transaction'

const actionPrefix = '[Transactions]'

export const GET_TRANSACTIONS = `${actionPrefix} HTTP/Get`
export const GET_TRANSACTIONS_SUCCESS = `${GET_TRANSACTIONS} ${
  suffixes.success
}`
export const GET_TRANSACTIONS_FAILED = `${GET_TRANSACTIONS} ${suffixes.failed}`
export const SET_TRANSACTIONS = `${actionPrefix} Set`

export class GetTransactionsAction implements Action {
  readonly type = GET_TRANSACTIONS

  constructor(public payload: TransactionRequestOpts) {}
}

export class SetTransactionsAction implements Action {
  readonly type = SET_TRANSACTIONS

  constructor(public payload: MonzoTransactionResponse[]) {}
}

export class GetTransactionsFailedAction implements Action {
  readonly type = GET_TRANSACTIONS_FAILED
}

export type Actions =
  | GetTransactionsAction
  | SetTransactionsAction
  | GetTransactionsFailedAction
