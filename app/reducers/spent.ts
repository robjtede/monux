import { Reducer, ReducersMapObject } from 'redux'

import { EActions } from '../actions/index'
import { ISetSpentAction } from '../actions/setSpent'
import { ISpentState } from '../store'

const initialState: ISpentState = {
  native: {
    amount: 0,
    currency: 'GBP'
  }
}

export const reducer: Reducer<ISpentState> = (state = initialState, action) => {
  const types = {
    [EActions.SET_SPENT]: (state: ISpentState, action: ISetSpentAction) => {
      return {
        ...action.amount
      }
    }
  } as ReducersMapObject

  return action.type in types ? types[action.type](state, action) : state
}

export default reducer
