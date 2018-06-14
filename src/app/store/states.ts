import { MonzoAccountResponse } from '../../lib/monzo/Account'
import { MonzoBalanceResponse } from '../../lib/monzo/Amount'
import { MonzoTransactionResponse } from '../../lib/monzo/Transaction'

export type AccountState = MonzoAccountResponse
export type BalanceState = MonzoBalanceResponse
export type SelectedTransactionState = string
export type TransactionsState = MonzoTransactionResponse[]

export interface AppState {
  account?: AccountState
  balance?: BalanceState
  selectedTransaction?: SelectedTransactionState
  transactions: TransactionsState
}
