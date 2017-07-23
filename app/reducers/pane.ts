import { Reducer, ReducersMapObject } from 'redux'

import { EActions } from '../actions/index'
import { ISetPaneAction } from '../actions/pane'
import { IPaneState } from '../store'

const initialState: IPaneState = 'transaction'

export const reducer: Reducer<IPaneState> = (state = initialState, action) => {
  const types = {
    [EActions.SET_PANE]: (state: IPaneState, action: ISetPaneAction) => {
      return action.pane as IPaneState
    }
  } as ReducersMapObject

  return action.type in types ? types[action.type](state, action) : state
}

export default reducer
