import { handleActions } from 'redux-actions'

import { setAccount, ISetAccountPayload } from '../actions'
import { IAccountState } from '../store'

const initialState: IAccountState = {
  name: '',
  bank: ''
}

const reducer = handleActions<IAccountState, ISetAccountPayload>(
  {
    [setAccount.toString()]: (_, action) => {
      if (!action.payload) throw new TypeError('A payload is required')

      return {
        name: action.payload.name,
        bank: action.payload.bank.toLowerCase()
      }
    }
  },
  initialState
)

export default reducer
