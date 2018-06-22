import { routerReducer } from '@ngrx/router-store'

import { reducer as account } from './reducers/account.reducer'
import { reducer as balance } from './reducers/balance.reducer'
import { reducer as selectedTransaction } from './reducers/selectedTransaction.reducer'
import { reducer as transactions } from './reducers/transactions.reducer'

import { AppState, TransactionsState } from './states'

export const reducers = {
  account,
  balance,
  router: routerReducer,
  selectedTransaction,
  transactions
}

// TODO: should be AppState compatible
export const initialState = {
  transactions: [] as TransactionsState,
  selectedTransaction: 'tx_00009Xs5V2XQx3d9Rsuwjp'
}

export * from './states'
