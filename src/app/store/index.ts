import { reducer as accountReducer } from './reducers/account.reducer'
import { reducer as balanceReducer } from './reducers/balance.reducer'
import { reducer as selectedTransactionReducer } from './reducers/selectedTransaction.reducer'

export const reducers = {
  accountReducer,
  balanceReducer,
  selectedTransactionReducer
}

// TODO: solve import loop
export const suffixes = {
  success: ' (Success)',
  failed: ' (Failed)'
}

export * from './states'
