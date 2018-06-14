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
      return (action as SetTransactionsAction).payload
  }

  return state
}
