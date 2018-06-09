import { Actions, SET_ACCOUNT } from '../actions/account.actions'
import { AccountState } from '../states'

export const reducer = (state: AccountState, action: Actions): AccountState => {
  switch (action.type) {
    case SET_ACCOUNT:
      return action.payload
  }

  return state
}
