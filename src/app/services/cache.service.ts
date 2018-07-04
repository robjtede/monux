import { Injectable } from '@angular/core'
import { from, Observable, of } from 'rxjs'
import { map, switchMapTo } from 'rxjs/operators'
import Dexie from 'dexie'
import Debug = require('debug')

import { MonzoBalanceResponse } from '../../lib/monzo/Amount'
import { MonzoAccountResponse } from '../../lib/monzo/Account'
import {
  MonzoTransactionResponse,
  TransactionRequestOpts
} from '../../lib/monzo/Transaction'

const debug = Debug('app:service:cache')

export class MonuxCache extends Dexie {
  accounts!: Dexie.Table<CachedAccount, string>
  transactions!: Dexie.Table<CachedTransaction, string>
  balances!: Dexie.Table<CachedBalance, string>

  constructor() {
    super('MonuxCache')

    this.version(1).stores({
      accounts: 'id',
      transactions: 'id, accId'
    })

    this.version(2).stores({
      balances: 'accId, createdAt, updatedAt',
      transactions: 'id, accId, createdAt, updatedAt'
    })
  }
}

@Injectable()
export class CacheService {
  private readonly db: MonuxCache

  constructor() {
    this.db = new MonuxCache()
  }

  deleteAll(): Observable<boolean> {
    const deletions = Promise.all([
      this.db.accounts.clear(),
      this.db.transactions.clear(),
      this.db.delete()
    ])

    return from(deletions).pipe(switchMapTo(of(true)))
  }

  loadAccounts(): Observable<CachedAccount[]> {
    debug('loading all cached accounts')
    return from(this.db.accounts.toArray())
  }

  loadAccount(accId: string): Observable<CachedAccount> {
    debug('loading account', accId)
    return from(this.db.accounts.get(accId)).pipe(
      map(acc => {
        if (!acc) throw new Error('no account with ID exists')
        return acc
      })
    )
  }

  loadBalance(accId: string): Observable<CachedBalance> {
    debug('loading balance for', accId)
    return from(this.db.balances.get(accId)).pipe(
      map(balance => {
        if (!balance) {
          throw new Error(`cannot find balance with account ID ${accId}`)
        }

        return balance
      })
    )
  }

  loadTransactions(
    accId: string,
    { since, before, limit }: TransactionRequestOpts = {}
  ): Observable<MonzoTransactionResponse[]> {
    debug('loading transactions for', accId)

    let txCol = this.db.transactions.where({ accId })

    if (since) {
      if (since instanceof Date) {
        txCol = txCol.filter(tx => tx.createdAt > since)
      } else {
        const sinceDate = new Date(since)
        txCol = txCol.filter(tx => tx.createdAt > sinceDate)
      }
    }

    if (before) {
      txCol = txCol.filter(tx => tx.createdAt > before)
    }

    if (limit) {
      txCol = txCol.limit(limit)
    }

    return from(txCol.reverse().sortBy('createdAt')).pipe(
      map(txs => txs.map(({ tx }) => tx))
    )
  }

  saveAccount(acc: MonzoAccountResponse): Observable<string> {
    debug('saving account', acc.id)
    return from(
      this.db.accounts.put({
        id: acc.id,
        type: 'monzo_uk_retail',
        acc: acc,
        createdAt: new Date(acc.created),
        updatedAt: new Date()
      })
    )
  }

  saveBalance(
    accId: string,
    balance: MonzoBalanceResponse
  ): Observable<string> {
    debug('saving balance of', balance.balance, 'for', accId)
    return from(
      this.db.balances.put({
        accId,
        balance,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    )
  }

  saveTransactions(
    accId: string,
    txs: MonzoTransactionResponse[]
  ): Observable<string> {
    debug('saving', txs.length, 'transactions for', accId)
    const entries = txs.map(tx => ({
      id: tx.id,
      accId,
      tx: tx,
      createdAt: new Date(tx.created),
      updatedAt: new Date(tx.updated)
    }))

    return from(this.db.transactions.bulkPut(entries))
  }
}

export interface CachedTransaction {
  id: string
  accId: string
  tx: MonzoTransactionResponse
  createdAt: Date
  updatedAt: Date
}

export interface CachedAccount {
  id: string
  acc: MonzoAccountResponse
  type: 'monzo_uk_retail'
  createdAt: Date
  updatedAt: Date
}

export interface CachedBalance {
  accId: string
  balance: MonzoBalanceResponse
  createdAt: Date
  updatedAt: Date
}
