import { sortBy } from 'lodash'
import { getTime } from 'date-fns'

import {
  Actions,
  SET_TRANSACTIONS,
  SetTransactionsAction,
  SET_TRANSACTION,
  SetTransactionAction
} from '../actions/transactions.actions'
import { TransactionsState } from '../states'

export function reducer(
  state: TransactionsState,
  action: Actions
): TransactionsState {
  switch (action.type) {
    case SET_TRANSACTIONS:
      const txs = (action as SetTransactionsAction).payload
      return sortBy(txs, tx => -getTime(tx.created))

    case SET_TRANSACTION:
      const updatedTx = (action as SetTransactionAction).tx
      return sortBy(
        [...state.filter(tx => tx.id !== updatedTx.id), updatedTx],
        tx => -getTime(tx.created)
      )
  }

  return state
}
