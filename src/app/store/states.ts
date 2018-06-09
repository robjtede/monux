import { MonzoAccountResponse } from '../../lib/monzo/Account'
import { MonzoBalanceResponse } from '../../lib/monzo/Amount'

export type AccountState = MonzoAccountResponse
export type BalanceState = MonzoBalanceResponse
export type SelectedTransactionState = string | undefined

// TODO: decide wether states should be optional
export interface AppState {
  account: AccountState
  balance: BalanceState
  selectedTransaction: SelectedTransactionState
}
