import { handleActions } from 'redux-actions'

import { SpentActions, SetSpentPayload } from '../actions/spent'
import { SpentState } from '../state'

const initialState: SpentState = {
  native: {
    amount: 0,
    currency: 'GBP'
  }
}

export const reducer = handleActions<SpentState, SetSpentPayload>(
  {
    [SpentActions.SET_SPENT]: (_, { payload }) => {
      if (!payload) throw new TypeError('A payload is required')

      return payload.amount
    }
  },
  initialState
)
