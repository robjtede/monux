import { Action } from '@ngrx/store'

import { suffixes } from './'

import { MonzoAccountResponse } from '../../../lib/monzo/Account'

const actionPrefix = '[Account]'

export const GET_ACCOUNT = `${actionPrefix} HTTP/Get`
export const GET_ACCOUNT_SUCCESS = `${GET_ACCOUNT} ${suffixes.success}`
export const GET_ACCOUNT_FAILED = `${GET_ACCOUNT} ${suffixes.failed}`
export const SET_ACCOUNT = `${actionPrefix} Set`

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
