import { JSONMap } from 'json-types'
import { QueryString, MonzoRequest } from './api'

export class Account {
  constructor(private readonly acc: MonzoAccountResponse) {}

  get created(): Date {
    return new Date(this.acc.created)
  }

  get description(): string {
    return this.acc.description
  }

  get id(): string {
    return this.acc.id
  }

  get name(): string {
    return this.owners[0].preferred_name
  }

  get owners(): AccountOwner[] {
    return this.acc.owners
  }

  balanceRequest(): MonzoRequest {
    return {
      path: '/balance',
      qs: {
        account_id: this.id
      }
    }
  }

  transactionRequest(txId: string): MonzoRequest {
    return {
      path: `/transactions/${txId}`,
      qs: {
        'expand[]': 'merchant'
      }
    }
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
        opts.since = options.since.toISOString()
      } else {
        opts.since = options.since
      }
    }

    if (options.before) {
      opts.before = options.before.toISOString()
    }

    if (options.limit) {
      opts.limit = options.limit
    }

    return {
      path: '/transactions',
      qs: opts
    }
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
}

export const accountsRequest = () => {
  return {
    path: '/accounts',
    qs: {
      account_type: 'uk_retail'
    }
  }
}

export interface MonzoAccountsResponse extends JSONMap {
  accounts: MonzoAccountResponse[]
}

export interface AccountOwner extends JSONMap {
  user_id: string
  preferred_name: string
}

export interface MonzoAccountResponse extends JSONMap {
  id: string
  description: string
  created: string
  type: string
  account_number: string
  sort_code: string
  owners: AccountOwner[]
}

export interface MonzoTransactionQuery extends QueryString {
  account_id: string
  'expand[]'?: string
  since?: string
  before?: string
  limit?: number
}
