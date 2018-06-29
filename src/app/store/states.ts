import { MonzoAccountResponse } from '../../lib/monzo/Account'
import { MonzoBalanceResponse } from '../../lib/monzo/Amount'
import { MonzoTransactionResponse } from '../../lib/monzo/Transaction'
import { JSONMap } from 'json-types'

export type AccountState = MonzoAccountResponse | undefined
export type BalanceState = MonzoBalanceResponse | undefined
export type SelectedTransactionState = string | undefined
export type TransactionsState = MonzoTransactionResponse[]

export interface AppState {
  account: AccountState
  balance: BalanceState
  selectedTransaction: SelectedTransactionState
  transactions: TransactionsState
}
