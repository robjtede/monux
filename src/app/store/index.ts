import { routerReducer } from '@ngrx/router-store'

import { reducer as accountReducer } from './reducers/account.reducer'
import { reducer as balanceReducer } from './reducers/balance.reducer'
import { reducer as selectedTransactionReducer } from './reducers/selectedTransaction.reducer'
import { reducer as transactionsReducer } from './reducers/transactions.reducer'

import { AppState, TransactionsState } from './states'

export const reducers = {
  account: accountReducer,
  balance: balanceReducer,
  router: routerReducer,
  selectedTransaction: selectedTransactionReducer,
  transactions: transactionsReducer
}

// TODO: should be AppState compatible
export const initialState = {
  transactions: [] as TransactionsState
}

export * from './states'
