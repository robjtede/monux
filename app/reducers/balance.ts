import { Reducer, ReducersMapObject } from 'redux'

import { EActions } from '../actions/index'
import { ISetBalanceAction } from '../actions/balance'
import { IBalanceState } from '../store'

const initialState: IBalanceState = {
  native: {
    amount: 0,
    currency: 'GBP'
  }
}

export const reducer: Reducer<IBalanceState> = (
  state = initialState,
  action
) => {
  const types = {
    [EActions.SET_BALANCE]: (
      state: IBalanceState,
      action: ISetBalanceAction
    ) => {
      return {
        ...action.amount
      } as IBalanceState
    }
  } as ReducersMapObject

  return action.type in types ? types[action.type](state, action) : state
}

export default reducer
