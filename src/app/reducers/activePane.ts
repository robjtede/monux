import { handleActions } from 'redux-actions'

import { PaneActions, SetPanePayload } from '../actions/pane'
import { ActivePaneState } from '../store'

const initialState: ActivePaneState = 'transaction'

export const reducer = handleActions<ActivePaneState, SetPanePayload>(
  {
    [PaneActions.SET_PANE]: (_, { payload }) => {
      if (!payload) throw new TypeError('A payload is required')

      return payload.pane
    }
  },
  initialState
)
