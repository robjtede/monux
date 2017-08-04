import { createAction } from 'redux-actions'

import { EActions } from './index'
import { IAmountOptions } from '../../lib/monzo'

export interface ISetSpentPayload {
  amount: IAmountOptions
}

export const setSpent = createAction<
  ISetSpentPayload,
  IAmountOptions
>(EActions.SET_SPENT, spent => ({
  amount: spent
}))
