import { Actions, OPEN_MODAL, CLOSE_MODAL } from '../actions/modal.actions'
import { ModalState } from '../states'

export function reducer(state: ModalState, action: Actions): ModalState {
  switch (action.type) {
    case OPEN_MODAL:
      return {
        open: true
      }

    case CLOSE_MODAL:
      return {
        open: false
      }
  }

  return state
}
