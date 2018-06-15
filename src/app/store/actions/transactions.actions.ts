import { Action } from '@ngrx/store'

import {
  MonzoTransactionResponse,
  TransactionRequestOpts
} from '../../../lib/monzo/Transaction'

export const GET_TRANSACTIONS = '[Transactions] HTTP/Get'
export const GET_TRANSACTIONS_SUCCESS = `${GET_TRANSACTIONS} (Success)`
export const GET_TRANSACTIONS_FAILED = `${GET_TRANSACTIONS} (Failed)`
export const SET_TRANSACTIONS = '[Transactions] Set'

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
