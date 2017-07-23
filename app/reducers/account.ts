import { Reducer, ReducersMapObject } from 'redux'

import { EActions } from '../actions/index'
import { ISetAccountAction } from '../actions'
import { IAccountState } from '../store'

const initialState: IAccountState = {
  name: '--- ---',
  bank: 'monzo'
}

export const reducer: Reducer<IAccountState> = (
  state = initialState,
  action
) => {
  const types = {
    [EActions.SET_ACCOUNT]: (
      state: IAccountState,
      action: ISetAccountAction
    ) => {
      return {
        name: action.name,
        bank: action.bank.toLowerCase()
      } as IAccountState
    }
  } as ReducersMapObject

  return action.type in types ? types[action.type](state, action) : state
}

export default reducer
