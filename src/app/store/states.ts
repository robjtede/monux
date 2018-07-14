import {
  MonzoAccountResponse,
  MonzoBalanceResponse,
  MonzoTransactionResponse
} from 'monzolib'

// import { JSONMap } from 'json-types'

// should conform to JSONMap with undefineds
export interface AppState {
  account?: MonzoAccountResponse
  balance?: MonzoBalanceResponse
  selectedTransaction?: string
  transactions: MonzoTransactionResponse[]
  modal: { open: boolean }
}

export type AccountState = AppState['account']
export type BalanceState = AppState['balance']
export type SelectedTransactionState = AppState['selectedTransaction']
export type TransactionsState = AppState['transactions']
export type ModalState = AppState['modal']

export type DefiniteAccountState = NonNullable<AppState['account']>
export type DefiniteBalanceState = NonNullable<AppState['balance']>
export type DefiniteSelectedTransactionState = NonNullable<
  AppState['selectedTransaction']
>
