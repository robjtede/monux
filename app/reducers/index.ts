import { Reducer, ReducersMapObject } from 'redux'

import { IState, initialState } from '../store'
import { EActions } from '../actions/index'
import { ISetSpentAction } from '../actions/setSpent'
import { ISetBalanceAction } from '../actions/setBalance'

export const reducer: Reducer<IState> = (state = initialState, action) => {
  const types = {
    [EActions.SET_SPENT]: (state: IState, action: ISetSpentAction) => {
      return {
        ...state,
        spent: action.amount
      }
    },
    [EActions.SET_BALANCE]: (state: IState, action: ISetBalanceAction) => {
      return {
        ...state,
        balance: action.amount
      }
    }
  } as ReducersMapObject

  return action.type in types ? types[action.type](state, action) : state
}
