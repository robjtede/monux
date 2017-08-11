import { handleActions } from 'redux-actions'

import { ISelectedTransactionsState } from '../store'
import {
  selectTransaction,
  ISelectTransactionPayload
} from '../actions/transaction'

const initialState: ISelectedTransactionsState = ''

export const reducer = handleActions<
  ISelectedTransactionsState,
  ISelectTransactionPayload
>(
  {
    [selectTransaction.toString()]: (_, { payload }) => {
      if (!payload) throw new TypeError('A payload is required')

      return payload.txId
    }
  },
  initialState
)

export default reducer
