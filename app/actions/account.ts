import { createAction } from 'redux-actions'

import { EActions } from './index'

export const setAccount = createAction(
  EActions.SET_ACCOUNT,
  (name: string, bank: string) => ({
    name,
    bank
  })
)
