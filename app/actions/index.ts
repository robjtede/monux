import { Action } from 'redux'

export enum EActions {
  SET_SPENT = 'SET_SPENT',
  SET_BALANCE = 'SET_BALANCE',
  SET_ACCOUNT = 'SET_ACCOUNT'
}

export interface IAction extends Action {
  type: EActions
}

import { setBalance, ISetBalanceAction } from './setBalance'
export { setBalance, ISetBalanceAction }

import { setSpent, ISetSpentAction } from './setSpent'
export { setSpent, ISetSpentAction }

import { setAccount, ISetAccountAction } from './setAccount'
export { setAccount, ISetAccountAction }
