import { ActionCreator } from 'redux'

import { IAction, EActions } from './index'
import { IAmountOptions } from '../../lib/monzo'

export interface ISetBalanceAction extends IAction {
  type: EActions.SET_BALANCE
  amount: IAmountOptions
}

export const setBalance: ActionCreator<ISetBalanceAction> = (
  balance: IAmountOptions
) => {
  return {
    type: EActions.SET_BALANCE,
    amount: balance
  }
}
