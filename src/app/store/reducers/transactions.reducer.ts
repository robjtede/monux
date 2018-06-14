import { sortBy } from 'lodash'
import { getTime } from 'date-fns'

import {
  Actions,
  SET_TRANSACTIONS,
  SetTransactionsAction
} from '../actions/transactions.actions'
import { TransactionsState } from '../states'

export const reducer = (
  state: TransactionsState,
  action: Actions
): TransactionsState => {
  switch (action.type) {
    case SET_TRANSACTIONS:
      const txs = (action as SetTransactionsAction).payload

      return sortBy(txs, tx => -getTime(tx.created))
  }

  return state
}
