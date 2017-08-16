import { Injectable } from '@angular/core'
import Dexie from 'dexie'

import Amount, { AmountOpts } from '../../lib/monzo/Amount'
import Account, { MonzoAccountResponse } from '../../lib/monzo/Account'
import Transaction, {
  MonzoTransactionResponse
} from '../../lib/monzo/Transaction'

class IDBCache extends Dexie {
  transactions: Dexie.Table<ICacheTransaction, string>
  accounts: Dexie.Table<ICacheAccount, string>

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

    return async (): Promise<ICacheAccount> => {
      return (await cachedAccount)[0]
    }
  })()

  loadBalance = (() => {
    const cachedAccount = this.loadAccount()

    return async (): Promise<{
      account: MonzoAccountResponse
      balance: AmountOpts
    }> => {
      const acc = await cachedAccount
      const { native, local } = acc.balance

      return {
        account: acc.acc,
        balance: { native, local }
      }
    }
  })()

  loadTransactions = (() => {
    const cachedTxs = this.db.transactions
      .orderBy('created_at')
      .reverse()
      .toArray()

    return async (): Promise<Transaction[]> => {
      return (await cachedTxs).map(({ tx }) => {
        return new Transaction(tx)
      })
    }
  })()

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
      txs.map(tx => {
        return {
          id: tx.id,
          accId: acc.id,
          tx: tx.json,
          created_at: tx.created,
          updated_at: new Date()
        }
      })
    )
  }
}

export interface ICacheTransaction {
  id: string
  accId: string
  tx: MonzoTransactionResponse
  created_at: Date
  updated_at: Date
}

export interface ICacheAccount {
  id: string
  type: 'monzo'
  acc: MonzoAccountResponse
  balance: AmountOpts
  created_at: Date
  updated_at: Date
}
