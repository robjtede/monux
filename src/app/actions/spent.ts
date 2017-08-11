import { createAction } from 'redux-actions'

import { EActions } from './'

import { AmountOpts } from '../../lib/monzo/Amount'

export const setSpent = createAction<
  SetSpentPayload,
  AmountOpts
>(EActions.SET_SPENT, spent => ({
  amount: spent
}))

export interface SetSpentPayload {
  amount: AmountOpts
}
