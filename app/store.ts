import { applyMiddleware, createStore, Store, compose } from 'redux'

import {
  IAmountOptions,
  IMonzoApiTransaction,
  IMonzoApiAccount
} from '../lib/monzo'

import reducer from './reducers'
import middleware from './middleware'

export type IActivePaneState = string
export type IBalanceState = IAmountOptions
export type ISpentState = IAmountOptions
export type ITransactionsState = IMonzoApiTransaction[]
export type ISelectedTransactionsState = string
export type IAccountState = {
  monzo?: IMonzoApiAccount
}

export interface IState {
  account: IAccountState
  activePane: IActivePaneState
  balance: IBalanceState
  spent: ISpentState
  transactions: ITransactionsState
  selectedTransaction: ISelectedTransactionsState
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
