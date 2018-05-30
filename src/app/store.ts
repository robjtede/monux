import { AmountOpts } from '../lib/monzo/Amount'
import { MonzoTransactionResponse } from '../lib/monzo/Transaction'
import { MonzoAccountResponse } from '../lib/monzo/Account'

export type ActivePaneState = string
export type BalanceState = AmountOpts
export type SpentState = AmountOpts
export type TransactionsState = MonzoTransactionResponse[]
export type SelectedTransactionsState = string
export type AccountState = {
  monzo?: MonzoAccountResponse
}

// export interface AppState {
//   account: AccountState
//   activePane: ActivePaneState
//   balance: BalanceState
//   spent: SpentState
//   transactions: TransactionsState
//   selectedTransaction: SelectedTransactionsState
// }

// TODO: strongly typed state
export type AppState = any
