import { ActionCreator } from 'redux'

import { IAction, EActions } from './index'
import { IAmountOptions } from '../../lib/monzo'

export interface ISetSpentAction extends IAction {
  type: EActions.SET_SPENT
  amount: IAmountOptions
}

export const setSpent: ActionCreator<ISetSpentAction> = spent => {
  return {
    type: EActions.SET_SPENT,
    amount: spent
  }
}
