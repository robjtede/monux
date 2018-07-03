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

export type DefiniteAccountState = Exclude<AppState['account'], undefined>
export type DefiniteBalanceState = Exclude<AppState['balance'], undefined>
export type DefiniteSelectedTransactionState = Exclude<
  AppState['selectedTransaction'],
  undefined
>
