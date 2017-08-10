import { handleActions } from 'redux-actions'

import { setSpent, ISetSpentPayload } from '../actions'
import { ISpentState } from '../store'

const initialState: ISpentState = {
  native: {
    amount: 0,
    currency: 'GBP'
  }
}

export const reducer = handleActions<ISpentState, ISetSpentPayload>(
  {
    [setSpent.toString()]: (_, action) => {
      if (!action.payload) throw new TypeError('A payload is required')

      return action.payload.amount
    }
  },
  initialState
)

export default reducer
