import { Action } from 'redux'

export enum EActions {
  SET_SPENT = 'SET_SPENT',
  SET_BALANCE = 'SET_BALANCE',
  SET_ACCOUNT = 'SET_ACCOUNT'
}

export interface IAction extends Action {
  type: EActions
}

import { setBalance, ISetBalanceAction } from './balance'
export { setBalance, ISetBalanceAction }

import { setSpent, ISetSpentAction } from './spent'
export { setSpent, ISetSpentAction }

import { setAccount, ISetAccountAction } from './account'
export { setAccount, ISetAccountAction }
