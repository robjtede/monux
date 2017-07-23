import { Reducer, ReducersMapObject } from 'redux'

import { EActions } from '../actions/index'
import { ISelectTransactionAction } from '../actions'
import { ISelectedTransactionsState } from '../store'

const initialState: ISelectedTransactionsState = ''

export const reducer: Reducer<ISelectedTransactionsState> = (
  state = initialState,
  action
) => {
  const types = {
    [EActions.SELECT_TRANSACTION]: (
      state: ISelectedTransactionsState,
      action: ISelectTransactionAction
    ) => {
      return action.txId as ISelectedTransactionsState
    }
  } as ReducersMapObject

  return action.type in types ? types[action.type](state, action) : state
}

export default reducer
