import {
  Actions,
  SELECT_TRANSACTION,
  DESELECT_TRANSACTION,
  SelectTransactionAction
} from '../actions/selectedTransaction.actions'
import { SelectedTransactionState } from '../states'

export function reducer(
  state: SelectedTransactionState,
  action: Actions
): SelectedTransactionState {
  switch (action.type) {
    case SELECT_TRANSACTION:
      return (action as SelectTransactionAction).payload

    case DESELECT_TRANSACTION:
      return undefined
  }

  return state
}
