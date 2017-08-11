import { handleActions } from 'redux-actions'

import { setBalance, ISetBalancePayload } from '../actions/balance'
import { IBalanceState } from '../store'

const initialState: IBalanceState = {
  native: {
    amount: 0,
    currency: 'GBP'
  }
}

export const reducer = handleActions<IBalanceState, ISetBalancePayload>(
  {
    [setBalance.toString()]: (_, action) => {
      if (!action.payload) throw new TypeError('A payload is required')

      return action.payload.amount
    }
  },
  initialState
)

export default reducer
