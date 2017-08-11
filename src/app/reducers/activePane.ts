import { handleActions } from 'redux-actions'

import { setPane, SetPanePayload } from '../actions/pane'
import { ActivePaneState } from '../store'

const initialState: ActivePaneState = 'transaction'

export const reducer = handleActions<ActivePaneState, SetPanePayload>(
  {
    [setPane.toString()]: (_, { payload }) => {
      if (!payload) throw new TypeError('A payload is required')

      return payload.pane
    }
  },
  initialState
)

export default reducer
