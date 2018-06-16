import {
  Actions,
  SET_BALANCE,
  SetBalanceAction
} from '../actions/balance.actions'
import { BalanceState } from '../states'

export function reducer(state: BalanceState, action: Actions): BalanceState {
  switch (action.type) {
    case SET_BALANCE:
      return (action as SetBalanceAction).payload
  }

  return state
}
