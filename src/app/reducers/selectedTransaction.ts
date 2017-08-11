import { handleActions } from 'redux-actions'

import { SelectedTransactionsState } from '../store'
import {
  selectTransaction,
  SelectTransactionPayload
} from '../actions/transaction'

const initialState: SelectedTransactionsState = ''

export const reducer = handleActions<
  SelectedTransactionsState,
  SelectTransactionPayload
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
