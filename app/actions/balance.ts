import { createAction } from 'redux-actions'

import { EActions } from './index'
import { IAmountOptions } from '../../lib/monzo'

export interface ISetBalancePayload {
  amount: IAmountOptions
}

export const setBalance = createAction<
  ISetBalancePayload,
  IAmountOptions
>(EActions.SET_BALANCE, balance => ({
  amount: balance
}))
