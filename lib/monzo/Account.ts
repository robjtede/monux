import {
  Amount,
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
        return {
          balance: new Amount({
            raw: bal.balance,
            currency: bal.currency,
            localRaw: bal.balance * bal.local_exchange_rate,
            localCurrency: bal.local_currency
          }),

          spentToday: new Amount({
            raw: bal.spend_today,
            currency: bal.currency,
            localRaw: bal.local_spend.length > 0 ? bal.local_spend[0].spend_today * bal.local_exchange_rate : 0,
            localCurrency: bal.local_currency
          })
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

        return txs
      })
      .then((txs) => txs
        .transactions
        .map((tx: IMonzoApiTransaction, index: number) => {
          return new Transaction(this.monzo, this, tx, index)
        })
      )
  }
}
