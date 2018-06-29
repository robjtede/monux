import { Injectable } from '@angular/core'
import { from, Observable, of } from 'rxjs'
import { map, switchMapTo } from 'rxjs/operators'
import Dexie from 'dexie'
import Debug = require('debug')

import {
  Amount,
  AmountOpts,
  MonzoBalanceResponse
} from '../../lib/monzo/Amount'
import { Account, MonzoAccountResponse } from '../../lib/monzo/Account'
import {
  Transaction,
  MonzoTransactionResponse,
  TransactionRequestOpts
} from '../../lib/monzo/Transaction'

const debug = Debug('app:service:cache')

export class MonuxCache extends Dexie {
  accounts!: Dexie.Table<CachedAccount, string>
  transactions!: Dexie.Table<CachedTransaction, string>
  balances!: Dexie.Table<CachedBalance, number>

  constructor() {
    super('MonuxCache')

    this.version(1).stores({
      accounts: 'id',
      transactions: 'id, accId'
    })

    this.version(2).stores({
      balances: '++, accId'
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
    debug('getting all cached accounts')
    return from(this.db.accounts.toArray())
  }

  loadAccount(accId: string): Observable<CachedAccount> {
    return from(this.db.accounts.get(accId)).pipe(
      map(acc => {
        if (!acc) throw new Error('no account with ID exists')
        return acc
      })
    )
  }

  loadBalance(accId: string): Observable<CachedBalance> {
    return from(this.db.balances.get({ accId })).pipe(
      map(balance => {
        if (!balance) {
          throw new Error(`cannot find balance with account ID ${accId}`)
        }

        return balance
      })
    )
  }

  loadTransactions({
    since,
    before,
    limit
  }: TransactionRequestOpts = {}): Observable<MonzoTransactionResponse[]> {
    let txCol = this.db.transactions.orderBy('createdAt').reverse()

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

    return from(txCol.toArray()).pipe(map(txs => txs.map(tx => tx.tx)))
  }

  saveAccount(acc: MonzoAccountResponse): Observable<string> {
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

  saveTransactions(
    accId: string,
    txs: MonzoTransactionResponse[]
  ): Observable<string> {
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
