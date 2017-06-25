import Dexie from 'dexie'

class IDBCache extends Dexie {
  transactions: Dexie.Table<ICacheTransaction, number>

  constructor() {
    super('IDBCache')

    this.version(1).stores({
      transactions: 'id, bank, json',
      balances: '++id, bank, type, amount',
      banks: '++id, accId, name, type'
    })
  }
}

interface ICacheTransaction {
  id: string
  json: string
}

export default new IDBCache()
