import { reducer as selectedTransactionReducer } from './reducers/selectedTransaction.reducers'
import { reducer as balanceReducer } from './reducers/balance.reducers'

export const reducers = {
  selectedTransactionReducer,
  balanceReducer
}

// TODO: solve import loop
export const suffixes = {
  success: ' (Success)',
  failed: ' (Failed)'
}

export * from './states'
