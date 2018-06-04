import {
  SELECT_TRANSACTION,
  DESELECT_TRANSACTION,
  Actions
} from '../actions/selectedTransaction.actions'
import { SelectedTransactionState } from '../states'

export const reducer = (
  state: SelectedTransactionState,
  action: Actions
): SelectedTransactionState => {
  switch (action.type) {
    case SELECT_TRANSACTION:
      return action.payload

    case DESELECT_TRANSACTION:
      return undefined
  }

  return state
}
