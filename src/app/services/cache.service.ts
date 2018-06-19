import { Injectable } from '@angular/core'
import { from, Observable, of } from 'rxjs'
import { map, pluck, switchMap, switchMapTo } from 'rxjs/operators'

import Dexie from 'dexie'

import { Amount, AmountOpts } from '../../lib/monzo/Amount'
import { Account, MonzoAccountResponse } from '../../lib/monzo/Account'
import {
  Transaction,
  MonzoTransactionResponse,
  TransactionRequestOpts
} from '../../lib/monzo/Transaction'

class IDBCache extends Dexie {
  transactions!: Dexie.Table<CachedTransaction, string>
  accounts!: Dexie.Table<CachedAccount, string>

  constructor() {
    super('IDBCache')

    this.version(1).stores({
      transactions: 'id, created_at, accId',
      accounts: 'id, name, type'
    })

    this.version(2).stores({
      transactions: 'id, accId, created_at, updated_at',
      accounts: 'id, created_at, updated_at'
    })
  }
}

@Injectable()
export class CacheService {
  private db = new IDBCache()

  loadAccount = (() => {
    const cachedAccount = this.db.accounts.limit(1).toArray()

    return (): Observable<CachedAccount> => {
      return from(cachedAccount).pipe(pluck('0'))
    }
  })()

  deleteAll(): Observable<boolean> {
    const deletions = Promise.all([
      this.db.accounts.clear(),
      this.db.transactions.clear(),
      this.db.delete()
    ])

    return from(deletions).pipe(switchMapTo(of(true)))
  }

  loadBalance = (() => {
    const cachedAccount = this.loadAccount()

    return (): Observable<{
      account: MonzoAccountResponse
      balance: AmountOpts
    }> =>
      cachedAccount.pipe(
        switchMap(acc => {
          const { native, local } = acc.balance

          return {
            account: acc.acc,
            balance: { native, local }
          } as any
        })
      )
  })()

  loadTransactions({
    since,
    before,
    limit
  }: TransactionRequestOpts = {}): Observable<MonzoTransactionResponse[]> {
    let txCol = this.db.transactions.orderBy('created_at').reverse()

    if (since) {
      if (since instanceof Date) {
        txCol = txCol.filter(tx => tx.created_at > since)
      } else {
        const sinceDate = new Date(since)
        txCol = txCol.filter(tx => tx.created_at > sinceDate)
      }
    }

    if (before) {
      txCol = txCol.filter(tx => tx.created_at > before)
    }

    if (limit) {
      txCol = txCol.limit(limit)
    }

    return from(txCol.toArray()).pipe(map(txs => txs.map(tx => tx.tx)))
  }

  saveAccount = async (acc: Account, balance: Amount) => {
    return this.db.accounts.put({
      id: acc.id,
      balance: balance.json,
      type: 'monzo',
      acc: acc.json,
      created_at: acc.created,
      updated_at: new Date()
    })
  }

  saveTransactions = async (acc: Account, txs: Transaction[]) => {
    await this.db.transactions.bulkPut(
      txs.map(tx => ({
        id: tx.id,
        accId: acc.id,
        tx: tx.json,
        created_at: tx.created,
        updated_at: new Date()
      }))
    )
  }
}

export interface CachedTransaction {
  id: string
  accId: string
  tx: MonzoTransactionResponse
  created_at: Date
  updated_at: Date
}

export interface CachedAccount {
  id: string
  type: 'monzo'
  acc: MonzoAccountResponse
  balance: AmountOpts
  created_at: Date
  updated_at: Date
}
