import { handleActions } from 'redux-actions'

import { SpentActions, SetSpentPayload } from '../actions/spent'
import { SpentState } from '../store'

const initialState: SpentState = {
  native: {
    amount: 0,
    currency: 'GBP'
  }
}

export const reducer = handleActions<SpentState, SetSpentPayload>(
  {
    [SpentActions.SET_SPENT]: (_, action) => {
      if (!action.payload) throw new TypeError('A payload is required')

      return action.payload.amount
    }
  },
  initialState
)

export default reducer
