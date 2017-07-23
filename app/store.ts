import { applyMiddleware, createStore, Store, compose } from 'redux'

import { IAmountOptions } from '../lib/monzo'
import reducer from './reducers'
import middleware from './middleware'

export interface IAccountState {
  name: string
  type: string
}
export interface IBalanceState extends IAmountOptions {}
export interface ISpentState extends IAmountOptions {}

export interface IState {
  balance: IBalanceState
  spent: ISpentState
  account: IAccountState
}

interface ReduxWindow extends Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
}

const composeEnhancers =
  (window as ReduxWindow).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store: Store<IState> = createStore<IState>(
  reducer,
  composeEnhancers(applyMiddleware(...middleware))
)
export default store
