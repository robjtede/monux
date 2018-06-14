import { reducer as account } from './reducers/account.reducer'
import { reducer as balance } from './reducers/balance.reducer'
import { reducer as selectedTransaction } from './reducers/selectedTransaction.reducer'
import { reducer as transactions } from './reducers/transactions.reducer'

export const reducers = {
  account,
  balance,
  selectedTransaction,
  transactions
}

export const initialState = {
  transactions: []
}

// TODO: solve import loop
// export const suffixes = {
//   success: ' (Success)',
//   failed: ' (Failed)'
// }

export * from './states'
