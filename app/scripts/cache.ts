import Dexie from 'dexie'

import {
  Account,
  Amount,
  Transaction,
  IMonzoApiAccount,
  IMonzoApiTransaction,
  IAmountOptions
} from '../../lib/monzo'

export interface ICacheTransaction {
  id: string
  accId: string
  tx: IMonzoApiTransaction
  created_at: Date
  updated_at: Date
}

export interface ICacheAccount {
  id: string
  type: 'monzo'
  acc: IMonzoApiAccount
  balance: IAmountOptions
  created_at: Date
  updated_at: Date
}

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

const db = new IDBCache()
export default db

export const getCachedAccount = (() => {
  const cachedAccount = db.accounts.limit(1).toArray()

  return async (): Promise<ICacheAccount> => {
    return (await cachedAccount)[0]
  }
})()

export const getCachedBalance = (() => {
  const cachedAccount = getCachedAccount()

  return async (): Promise<Amount> => {
    const { native, local } = (await cachedAccount).balance

    return new Amount(native, local)
  }
})()

export const updateAccountCache = async (acc: Account, balance: Amount) => {
  return db.accounts.put({
    id: acc.id,
    balance: balance.json,
    type: 'monzo',
    acc: acc.json,
    created_at: acc.created,
    updated_at: new Date()
  })
}

export const getCachedTransactions = (() => {
  const cachedTxs = db.transactions.orderBy('created_at').reverse().toArray()

  return async (): Promise<Transaction[]> => {
    return (await cachedTxs).map(({ tx }, index) => {
      return new Transaction(undefined, undefined, tx, index)
    })
  }
})()

export const updateTransactionCache = async (
  acc: Account,
  txs: Transaction[]
) => {
  await db.transactions.bulkPut(
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
