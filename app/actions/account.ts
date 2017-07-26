import { createAction } from 'redux-actions'

import { EActions } from './index'

export interface ISetAccountPayload {
  name: string
  bank: string
}

export const setAccount = createAction<
  ISetAccountPayload,
  string,
  string
>(EActions.SET_ACCOUNT, (name, bank) => ({
  name,
  bank
}))
