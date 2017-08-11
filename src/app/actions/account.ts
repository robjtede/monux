import { createAction } from 'redux-actions'

import { EActions } from './'
import { MonzoAccountResponse } from '../../lib/monzo/Account'

export const setAccount = createAction<
  SetAccountPayload,
  string,
  MonzoAccountResponse
>(EActions.SET_ACCOUNT, (bank, acc) => ({
  bank,
  acc
}))

export interface SetAccountPayload {
  bank: string
  acc: MonzoAccountResponse
}
