import { Actions, SET_OFFLINE, SET_ONLINE } from '../actions/ONLINE.actions'
import { OnlineState } from '../states'

export function reducer(state: OnlineState, action: Actions): OnlineState {
  switch (action.type) {
    case SET_ONLINE:
      return true

    case SET_OFFLINE:
      return false
  }

  return state
}
