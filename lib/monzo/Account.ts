import { format } from 'date-fns'

import { Amount, IAmount, IMonzoApiTransaction, Monzo, Transaction } from './'

export interface IMonzoApiAccount {
  id: string
  description: string
  created: string
}

interface IMonzoApiTransactionOptions {
  account_id: string
  'expand[]'?: string
  since?: string
  before?: string
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

  get balance(): Promise<{ balance: Amount; spentToday: Amount }> {
    return this.monzo
      .request('/balance', {
        account_id: this.id
      })
      .then(bal => {
        const nativeBalance: IAmount = {
          amount: bal.balance,
          currency: bal.currency
        }

        const nativeSpend: IAmount = {
          amount: bal.spend_today,
          currency: bal.currency
        }

        if (bal.local_currency) {
          const localBalance: IAmount = {
            amount: bal.balance * bal.local_exchange_rate,
            currency: bal.local_currency
          }

          const localSpend: IAmount = {
            amount:
              bal.local_spend.length > 0
                ? bal.local_spend[0].spend_today * bal.local_exchange_rate
                : 0,
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

  async transaction(txId: string) {
    const tx = await this.monzo.request('/transactions', {
      account_id: this.id,
      id: txId,
      'expand[]': 'merchant'
    })

    return new Transaction(this.monzo, this, tx, undefined)
  }

  async transactions(
    options: { since?: Date | string; before?: Date } = {}
  ): Promise<Transaction[]> {
    const opts = {
      account_id: this.id,
      'expand[]': 'merchant'
    } as IMonzoApiTransactionOptions

    if (options.since) {
      if (options.since instanceof Date) {
        // TODO: correct format
        opts.since = format(options.since, 'DD MM YY')
      } else {
        opts.since = options.since
      }
    }

    if (options.before) {
      // TODO: correct format
      opts.before = format(options.before, 'DD MM YY')
    }

    const txs = await this.monzo.request('/transactions', opts)

    return txs.transactions.map((tx: IMonzoApiTransaction, index: number) => {
      return new Transaction(this.monzo, this, tx, index)
    })
  }
}
