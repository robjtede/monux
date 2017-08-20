import { handleActions } from 'redux-actions'

import { AccountActions, SetAccountPayload } from '../actions/account'
import { AccountState } from '../store'

export const initialState: AccountState = {}

export const reducer = handleActions<AccountState, SetAccountPayload>(
  {
    [AccountActions.SET_ACCOUNT]: (_, { payload }) => {
      if (!payload) throw new TypeError('A payload is required')

      return {
        [payload.bank]: payload.acc
      }
    }
  },
  initialState
)
