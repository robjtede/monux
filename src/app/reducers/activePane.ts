import { handleActions } from 'redux-actions'

import { setPane, ISetPanePayload } from '../actions/pane'
import { IActivePaneState } from '../store'

const initialState: IActivePaneState = 'transaction'

export const reducer = handleActions<IActivePaneState, ISetPanePayload>(
  {
    [setPane.toString()]: (_, { payload }) => {
      if (!payload) throw new TypeError('A payload is required')

      return payload.pane
    }
  },
  initialState
)

export default reducer
