import { format } from 'date-fns'

import { QueryString, MonzoRequest } from './api'

export default class Account {
  constructor(private readonly acc: MonzoAccountResponse) {}

  get id(): string {
    return this.acc.id
  }

  get name(): string {
    return this.description
  }

  get description(): string {
    return this.acc.description
  }

  get created(): Date {
    return new Date(this.acc.created)
  }

  get balanceRequest(): MonzoRequest {
    return {
      path: '/balance',
      qs: {
        account_id: this.id
      }
    }

    // TODO: move to service
    // return this.monzo
    //   .request('/balance', {
    //     account_id: this.id
    //   })
    //   .then(bal => {
    //     const nativeBalance: IAmount = {
    //       amount: bal.balance,
    //       currency: bal.currency
    //     }
    //
    //     const nativeSpend: IAmount = {
    //       amount: bal.spend_today,
    //       currency: bal.currency
    //     }
    //
    //     if (bal.local_currency) {
    //       const localBalance: IAmount = {
    //         amount: bal.balance * bal.local_exchange_rate,
    //         currency: bal.local_currency
    //       }
    //
    //       const localSpend: IAmount = {
    //         amount:
    //           bal.local_spend.length > 0
    //             ? bal.local_spend[0].spend_today * bal.local_exchange_rate
    //             : 0,
    //         currency: bal.local_currency
    //       }
    //
    //       return {
    //         balance: new Amount(nativeBalance, localBalance),
    //         spentToday: new Amount(nativeSpend, localSpend)
    //       }
    //     } else {
    //       return {
    //         balance: new Amount(nativeBalance),
    //         spentToday: new Amount(nativeSpend)
    //       }
    //     }
    //   })
  }

  transactionRequest(txId: string): MonzoRequest {
    return {
      path: `/transactions/${txId}`,
      qs: {
        'expand[]': 'merchant'
      }
    }

    // TODO: move to service
    // const res = await this.monzo.request(`/transactions/${txId}`, {
    //   'expand[]': 'merchant'
    // })
    //
    // return new Transaction(this.monzo, this, res.transaction, undefined)
  }

  transactionsRequest(
    options: { since?: Date | string; before?: Date; limit?: number } = {}
  ): MonzoRequest {
    const opts: MonzoTransactionQuery = {
      account_id: this.id,
      'expand[]': 'merchant'
    }

    if (options.since) {
      if (options.since instanceof Date) {
        opts.since = format(options.since, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
      } else {
        opts.since = options.since
      }
    }

    if (options.before) {
      opts.before = format(options.before, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
    }

    if (options.limit) {
      opts.limit = options.limit
    }

    return {
      path: '/transactions',
      qs: opts
    }

    // TODO: move to service
    // const txs = await this.monzo.request('/transactions', opts)
    //
    // return txs.transactions.map((tx: IMonzoApiTransaction, index: number) => {
    //   return new Transaction(this.monzo, this, tx, index)
    // })
  }

  targetsRequest(): MonzoRequest {
    const opts: QueryString = {
      account_id: this.id
    }

    return {
      path: '/targets',
      qs: opts
    }
  }

  limitsRequest(): MonzoRequest {
    const opts = {
      account_id: this.id
    }

    return {
      path: '/balance/limits',
      qs: opts
    }
  }

  cardsRequest(): MonzoRequest {
    const opts = {
      account_id: this.id
    }

    return {
      path: '/card/list',
      qs: opts
    }
  }

  freezeCardRequest(cardId: string): MonzoRequest {
    const opts = {
      card_id: cardId,
      status: 'INACTIVE'
    }

    return {
      path: '/card/toggle',
      qs: opts,
      method: 'PUT'
    }
  }

  defrostCardRequest(cardId: string): MonzoRequest {
    const opts = {
      card_id: cardId,
      status: 'ACTIVE'
    }

    return {
      path: '/card/toggle',
      qs: opts,
      method: 'PUT'
    }
  }

  get json(): MonzoAccountResponse {
    return this.acc
  }

  get stringify(): string {
    return JSON.stringify(this.json)
  }

  static accountsRequest(): MonzoRequest {
    return {
      path: '/accounts'
    }
  }
}

export interface MonzoAccountResponse {
  id: string
  description: string
  created: string
  type: string
}

interface MonzoTransactionQuery extends QueryString {
  account_id: string
  'expand[]'?: string
  since?: string
  before?: string
  limit?: number
}
