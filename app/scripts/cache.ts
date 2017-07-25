import Dexie from 'dexie'

import { Account, Amount, Transaction } from '../../lib/monzo'

export interface ICacheTransaction {
  id: string
  created_at: Date
  accId: string
  json: string
}

export interface ICacheAccount {
  id: string
  name: string
  type: string
  balance: string
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
    const { native, local } = JSON.parse((await cachedAccount).balance)

    return new Amount(native, local)
  }
})()

// TODO: redux middleware
export const updateAccountCache = async (acc: Account, balance: Amount) => {
  return db.accounts.put({
    id: acc.id,
    balance: balance.stringify,
    name: acc.name,
    type: 'Monzo'
  })
}

export const getCachedTransactions = (() => {
  const cachedTxs = db.transactions.orderBy('created_at').reverse().toArray()

  return async (): Promise<Transaction[]> => {
    try {
      return (await cachedTxs).map((tx: ICacheTransaction, index: number) => {
        return new Transaction(undefined, undefined, JSON.parse(tx.json), index)
      })
    } catch (err) {
      console.error(err)
      throw new Error(err)
    }
  }
})()

// TODO: redux middleware
export const updateTransactionCache = async (
  acc: Account,
  txs: Transaction[]
) => {
  try {
    await db.transactions.bulkPut(
      txs.map(tx => {
        return {
          id: tx.id,
          created_at: tx.created,
          accId: acc.id,
          json: tx.stringify
        }
      })
    )
  } catch (err) {
    console.error(err)
  }
}
