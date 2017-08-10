import { AmountOpts } from '../lib/monzo/Amount'
import { MonzoTransactionResponse } from '../lib/monzo/Transaction'
import { MonzoAccountResponse } from '../lib/monzo/Account'

export type IActivePaneState = string
export type IBalanceState = AmountOpts
export type ISpentState = AmountOpts
export type ITransactionsState = MonzoTransactionResponse[]
export type ISelectedTransactionsState = string
export type IAccountState = {
  monzo?: MonzoAccountResponse
}

export interface IState {
  account: IAccountState
  activePane: IActivePaneState
  balance: IBalanceState
  spent: ISpentState
  transactions: ITransactionsState
  selectedTransaction: ISelectedTransactionsState
}
