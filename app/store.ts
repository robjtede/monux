import { createStore, Store } from 'redux'

import { IAmountOptions } from '../lib/monzo'
import { reducer } from './reducers'

const store: Store<IState> = createStore(reducer)
export default store

export const initialState: IState = {
  balance: {
    native: {
      amount: 0,
      currency: 'GBP'
    },
    local: undefined
  }
}

export interface IState {
  balance: IAmountOptions
  spent?: IAmountOptions
}
