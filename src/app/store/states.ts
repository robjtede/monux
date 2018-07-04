import { MonzoAccountResponse } from '../../lib/monzo/Account'
import { MonzoBalanceResponse } from '../../lib/monzo/Amount'
import { MonzoTransactionResponse } from '../../lib/monzo/Transaction'
// import { JSONMap } from 'json-types'

// should conform to JSONMap with undefineds
export interface AppState {
  account?: MonzoAccountResponse
  balance?: MonzoBalanceResponse
  selectedTransaction?: string
  transactions: MonzoTransactionResponse[]
}

export type AccountState = AppState['account']
export type BalanceState = AppState['balance']
export type SelectedTransactionState = AppState['selectedTransaction']
export type TransactionsState = AppState['transactions']

export type DefiniteAccountState = NonNullable<AppState['account']>
export type DefiniteBalanceState = NonNullable<AppState['balance']>
export type DefiniteSelectedTransactionState = NonNullable<
  AppState['selectedTransaction']
>
