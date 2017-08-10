import { createAction } from 'redux-actions'

import { EActions } from './index'

import { AmountOpts } from '../../lib/monzo/Amount'

export interface ISetSpentPayload {
  amount: AmountOpts
}

export const setSpent = createAction<
  ISetSpentPayload,
  AmountOpts
>(EActions.SET_SPENT, spent => ({
  amount: spent
}))
