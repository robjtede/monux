import {
  Amount,
  IAmount,
  IMonzoApiTransaction,
  Monzo,
  Transaction
} from './'

export interface IMonzoApiAccount {
  id: string,
  description: string,
  created: string
}

export default class Account {
  private monzo: Monzo
  private acc: IMonzoApiAccount

  constructor(monzo: Monzo, acc: IMonzoApiAccount) {
    this.monzo = monzo
    this.acc = acc
  }

  get id(): string {
    return this.acc.id
  }

  get name(): string {
    return this.description
  }

  get description(): string {
    return this.acc.description
  }

  get created(): string {
    return this.acc.created
  }

  get balance(): Promise<{balance: Amount, spentToday: Amount}> {
    return this.monzo
      .request('/balance', {
        account_id: this.id
      })
      .then((bal) => {
        const nativeBalance: IAmount = {
          amount: 1,
          currency: ''
        }

        const nativeSpend: IAmount = {
          amount: bal.spend_today,
          currency: bal.currency
        }

        if (bal.currency !== bal.local_currency) {
          const localBalance: IAmount = {
            amount: bal.balance * bal.local_exchange_rate,
            currency: bal.local_currency
          }

          const localSpend: IAmount = {
            amount: bal.local_spend.length > 0 ? bal.local_spend[0].spend_today * bal.local_exchange_rate : 0,
            currency: bal.local_currency
          }

          return {
            balance: new Amount(nativeBalance, localBalance),
            spentToday: new Amount(nativeSpend, localSpend)
          }
        } else {
          return {
            balance: new Amount(nativeBalance),
            spentToday: new Amount(nativeSpend)
          }
        }
      })
  }

  get transactions(): Promise<Transaction[]> {
    return this.monzo
      .request('/transactions', {
        'account_id': this.id,
        'expand[]': 'merchant'
      })
      .then((txs) => {
        localStorage.setItem('transactions', JSON.stringify(txs.transactions))

        return txs.transactions
          .map((tx: IMonzoApiTransaction, index: number) => {
            return new Transaction(this.monzo, this, tx, index)
          })
      })
  }
}
