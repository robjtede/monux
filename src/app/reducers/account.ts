import { handleActions } from 'redux-actions'

import { setAccount, ISetAccountPayload } from '../actions'
import { IAccountState } from '../store'

const initialState: IAccountState = {}

const reducer = handleActions<IAccountState, ISetAccountPayload>(
  {
    [setAccount.toString()]: (_, action) => {
      if (!action.payload) throw new TypeError('A payload is required')

      return {
        [action.payload.bank]: action.payload.acc
      }
    }
  },
  initialState
)

export default reducer
