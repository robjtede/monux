import { MonzoBalanceResponse } from '../../lib/monzo/Amount'

export type BalanceState = MonzoBalanceResponse
export type SelectedTransactionState = string | undefined

// TODO: decide wether states should be optional
export interface AppState {
  selectedTransaction: SelectedTransactionState
  balance: BalanceState
}
