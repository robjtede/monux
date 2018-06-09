import { Action } from '@ngrx/store'

import { MonzoAccountResponse } from '../../../lib/monzo/Account'

export const GET_ACCOUNT = '[Account] HTTP/Get'
export const GET_ACCOUNT_SUCCESS = `${GET_ACCOUNT} (Success)`
export const GET_ACCOUNT_FAILED = `${GET_ACCOUNT} (Failed)`
export const SET_ACCOUNT = '[Account] Set'

export class GetAccountAction implements Action {
  readonly type = GET_ACCOUNT
}

export class SetAccountAction implements Action {
  readonly type = SET_ACCOUNT

  constructor(public payload: MonzoAccountResponse) {}
}

export class GetAccountFailedAction implements Action {
  readonly type = GET_ACCOUNT_FAILED
}

export type Actions = GetAccountAction | SetAccountAction
