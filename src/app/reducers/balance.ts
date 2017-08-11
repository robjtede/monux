import { handleActions } from 'redux-actions'

import { setBalance, SetBalancePayload } from '../actions/balance'
import { BalanceState } from '../store'

const initialState: BalanceState = {
  native: {
    amount: 0,
    currency: 'GBP'
  }
}

export const reducer = handleActions<BalanceState, SetBalancePayload>(
  {
    [setBalance.toString()]: (_, action) => {
      if (!action.payload) throw new TypeError('A payload is required')

      return action.payload.amount
    }
  },
  initialState
)

export default reducer
