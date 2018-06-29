import { Action } from '@ngrx/store'

import { suffixes } from './'

import { MonzoAccountResponse } from '../../../lib/monzo/Account'

const actionPrefix = '[Account]'

export const GET_ACCOUNT = `${actionPrefix} Get`
export const GET_ACCOUNT_SUCCESS = `${GET_ACCOUNT} ${suffixes.success}`
export const GET_ACCOUNT_FAILED = `${GET_ACCOUNT} ${suffixes.failed}`
export const SET_ACCOUNT = `${actionPrefix} Set`
export const LOGOUT = `${actionPrefix} Logout`
export const LOGOUT_FAILED = `${actionPrefix} Logout ${suffixes.failed}`

export class SetAccountAction implements Action {
  readonly type = SET_ACCOUNT

  constructor(public payload: MonzoAccountResponse) {}
}

export class GetAccountAction implements Action {
  readonly type = GET_ACCOUNT
}
export class GetAccountFailedAction implements Action {
  readonly type = GET_ACCOUNT_FAILED
}

export class LogoutAction implements Action {
  readonly type = LOGOUT
}
export class LogoutFailedAction implements Action {
  readonly type = LOGOUT_FAILED
}

export type Actions = GetAccountAction | SetAccountAction
