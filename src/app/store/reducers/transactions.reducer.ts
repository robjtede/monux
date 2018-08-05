import { sortBy, uniqBy } from 'lodash'
import { getTime } from 'date-fns'

import {
  Actions,
  SET_TRANSACTIONS,
  SetTransactionsAction,
  SET_TRANSACTION,
  SetTransactionAction,
  APPEND_TRANSACTION,
  AppendTransactionsAction
} from '../actions/transactions.actions'
import { TransactionsState } from '../states'

export function reducer(
  state: TransactionsState,
  action: Actions
): TransactionsState {
  const reductions: any = {
    [SET_TRANSACTIONS]: () => {
      const txs = (action as SetTransactionsAction).payload
      return sortBy(txs, tx => -getTime(tx.created))
    },

    [APPEND_TRANSACTION]: () => {
      const txs = (action as AppendTransactionsAction).payload
      const uniqeTxs = uniqBy([...state, ...txs], 'id')

      return sortBy(uniqeTxs, tx => -getTime(tx.created))
    },

    [SET_TRANSACTION]: () => {
      const updatedTx = (action as SetTransactionAction).tx
      return sortBy(
        [...state.filter(tx => tx.id !== updatedTx.id), updatedTx],
        tx => -getTime(tx.created)
      )
    }
  }

  return action.type in reductions ? reductions[action.type]() : state
}
