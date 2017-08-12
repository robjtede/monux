import { handleActions } from 'redux-actions'

import { AccountActions, SetAccountPayload } from '../actions/account'
import { AccountState } from '../store'

const initialState: AccountState = {}

const reducer = handleActions<AccountState, SetAccountPayload>(
  {
    [AccountActions.SET_ACCOUNT]: (_, action) => {
      if (!action.payload) throw new TypeError('A payload is required')

      return {
        [action.payload.bank]: action.payload.acc
      }
    }
  },
  initialState
)

export default reducer
