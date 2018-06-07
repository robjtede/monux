import { Action } from '@ngrx/store'

import { MonzoBalanceResponse } from '../../../lib/monzo/Amount'

export const GET_BALANCE = '[Balance] HTTP/Get'
export const GET_BALANCE_SUCCESS = `${GET_BALANCE} (Success)`
export const GET_BALANCE_FAILED = `${GET_BALANCE} (Failed)`
export const SET_BALANCE = '[Balance] Set'

export class GetBalanceAction implements Action {
  readonly type = GET_BALANCE
}

export class SetBalanceAction implements Action {
  readonly type = SET_BALANCE

  constructor(public payload: MonzoBalanceResponse) {}
}

export class GetBalanceFailedAction implements Action {
  readonly type = GET_BALANCE_FAILED
}

export type Actions =
  | GetBalanceAction
  | SetBalanceAction
  | GetBalanceFailedAction
