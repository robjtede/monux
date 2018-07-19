import { PotsState } from '../states'
import { Actions, SET_POTS, SetPotsAction } from '../actions/pots.actions'

export function reducer(state: PotsState, action: Actions): PotsState {
  switch (action.type) {
    case SET_POTS:
      return (action as SetPotsAction).payload
  }

  return state
}
