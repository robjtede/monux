import { reducer as account } from './reducers/account.reducer'
import { reducer as balance } from './reducers/balance.reducer'
import { reducer as selectedTransaction } from './reducers/selectedTransaction.reducer'
import { reducer as transactions } from './reducers/transactions.reducer'

import { AppState, TransactionsState } from './states'

export const reducers = {
  account,
  balance,
  selectedTransaction,
  transactions
}

export const initialState: AppState = {
  transactions: [] as TransactionsState
}

// TODO: solve import loop
// export const suffixes = {
//   success: ' (Success)',
//   failed: ' (Failed)'
// }

export * from './states'
