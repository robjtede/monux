import { routerReducer } from '@ngrx/router-store'

import { reducer as accountReducer } from './reducers/account.reducer'
import { reducer as balanceReducer } from './reducers/balance.reducer'
import { reducer as selectedTransactionReducer } from './reducers/selectedTransaction.reducer'
import { reducer as transactionsReducer } from './reducers/transactions.reducer'
import { reducer as potsReducer } from './reducers/pots.reducer'
import { reducer as modalReducer } from './reducers/modal.reducer'

import { AppState, TransactionsState, PotsState } from './states'

export const reducers = {
  account: accountReducer,
  balance: balanceReducer,
  router: routerReducer,
  selectedTransaction: selectedTransactionReducer,
  transactions: transactionsReducer,
  modal: modalReducer,
  pots: potsReducer
}

// TODO: should be AppState compatible
export const initialState = {
  transactions: [] as TransactionsState,
  pots: [] as PotsState,
  modal: {
    open: false
  }
}

export * from './states'
