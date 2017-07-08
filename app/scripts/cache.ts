import Dexie from 'dexie'

class IDBCache extends Dexie {
  transactions: Dexie.Table<ICacheTransaction, string>
  banks: Dexie.Table<ICacheBank, number>

  constructor() {
    super('IDBCache')

    this.version(1).stores({
      transactions: 'id, created_at, accId',
      banks: 'accId, name, type'
    })
  }
}

export interface ICacheTransaction {
  id: string
  created_at: Date
  accId: string
  json: string
}

export interface ICacheBank {
  accId: string
  name: string
  type: string
  balance: string
}

export default new IDBCache()