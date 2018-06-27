import { Injectable } from '@angular/core'
import { from, Observable, of } from 'rxjs'
import { map, switchMapTo } from 'rxjs/operators'

import Dexie from 'dexie'

import { Amount, AmountOpts } from '../../lib/monzo/Amount'
import { Account, MonzoAccountResponse } from '../../lib/monzo/Account'
import {
  Transaction,
  MonzoTransactionResponse,
  TransactionRequestOpts
} from '../../lib/monzo/Transaction'

export class MonuxCache extends Dexie {
  transactions!: Dexie.Table<CachedTransaction, string>
  accounts!: Dexie.Table<CachedAccount, string>

  constructor() {
    super('MonuxCache')

    this.version(1).stores({
      transactions: 'id, accId, createdAt, updatedAt',
      accounts: 'id, createdAt, updatedAt'
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

  loadAccounts$(): Observable<CachedAccount[]> {
    return from(this.db.accounts.toArray())
  }

  loadAccount$(accId: string): Observable<CachedAccount> {
    return from(this.db.accounts.get(accId)).pipe(
      map(acc => {
        if (!acc) throw new Error('no account with ID exists')
        return acc
      })
    )
  }

  loadBalance$(accId: string): Observable<any> {
    return this.loadAccount$(accId).pipe(
      map(({ acc, balance }) => {
        const { native, local } = balance

        return {
          account: acc,
          balance: { native, local }
        }
      })
    )
  }

  loadTransactions$({
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

  saveAccount$(acc: Account, balance: Amount): Observable<string> {
    return from(
      this.db.accounts.put({
        id: acc.id,
        balance: balance.json,
        type: 'monzo',
        acc: acc.json,
        createdAt: acc.created,
        updatedAt: new Date()
      })
    )
  }

  saveTransactions$(acc: Account, txs: Transaction[]): Observable<string> {
    const entries = txs.map(tx => ({
      id: tx.id,
      accId: acc.id,
      tx: tx.json,
      createdAt: tx.created,
      updatedAt: new Date()
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
  type: 'monzo'
  acc: MonzoAccountResponse
  balance: AmountOpts
  createdAt: Date
  updatedAt: Date
}
