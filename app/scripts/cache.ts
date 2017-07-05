import Dexie from 'dexie'

class IDBCache extends Dexie {
  transactions: Dexie.Table<ICacheTransaction, string>
  banks: Dexie.Table<ICacheBank, number>

  constructor() {
    super('IDBCache')

    this.version(1).stores({
      transactions: 'id, bankId, json',
      banks: 'accId, name, type, balance'
    })
  }
}

export interface ICacheTransaction {
  id: string
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
