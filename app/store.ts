import { createStore, Store } from 'redux'

import { IAmountOptions } from '../lib/monzo'
import reducer from './reducers'

export interface IBalanceState extends IAmountOptions {}
export interface ISpentState extends IAmountOptions {}

export interface IState {
  balance: IBalanceState
  spent: ISpentState
}

export const store: Store<IState> = createStore<IState>(reducer)
export default store
