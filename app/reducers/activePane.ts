import { Reducer, ReducersMapObject } from 'redux'

import { EActions } from '../actions/index'
import { ISetPaneAction } from '../actions'
import { IActivePaneState } from '../store'

const initialState: IActivePaneState = 'transaction'

export const reducer: Reducer<IActivePaneState> = (
  state = initialState,
  action
) => {
  const types = {
    [EActions.SET_PANE]: (state: IActivePaneState, action: ISetPaneAction) => {
      return action.pane as IActivePaneState
    }
  } as ReducersMapObject

  return action.type in types ? types[action.type](state, action) : state
}

export default reducer
