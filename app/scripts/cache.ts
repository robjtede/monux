import Dexie from 'dexie'

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

export default new IDBCache()
