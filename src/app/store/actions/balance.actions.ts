import { Action } from '@ngrx/store'

import { suffixes } from './'

import { AmountOpts } from '../../../lib/monzo/Amount'

const actionPrefix = '[Balance]'

export const GET_BALANCE = `${actionPrefix} HTTP/Get`
export const GET_BALANCE_SUCCESS = `${GET_BALANCE} ${suffixes.success}`
export const GET_BALANCE_FAILED = `${GET_BALANCE} ${suffixes.failed}`
export const SET_BALANCE = `${actionPrefix} Set`

export class GetBalanceAction implements Action {
  readonly type = GET_BALANCE
}

export class SetBalanceAction implements Action {
  readonly type = SET_BALANCE

  constructor(public payload: AmountOpts) {}
}

export class GetBalanceFailedAction implements Action {
  readonly type = GET_BALANCE_FAILED
}

export type Actions =
  | GetBalanceAction
  | SetBalanceAction
  | GetBalanceFailedAction
