import { handleActions } from 'redux-actions'

import { SelectedTransactionsState } from '../state'
import {
  TransactionActions,
  SelectTransactionPayload
} from '../actions/transaction'

const initialState: SelectedTransactionsState = ''

export const reducer = handleActions<
  SelectedTransactionsState,
  SelectTransactionPayload
>(
  {
    [TransactionActions.SELECT_TRANSACTION]: (_, { payload }) => {
      if (!payload) throw new TypeError('A payload is required')

      return payload.txId
    }
  },
  initialState
)
