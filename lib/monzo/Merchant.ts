import undefsafe = require('undefsafe')

export interface IMonzoApiMerchant {
  id: string
  group_id: string
  [propName: string]: any
}

export default class Merchant {
  private merchant: IMonzoApiMerchant | null

  constructor(merchant: IMonzoApiMerchant | null) {
    this.merchant = merchant
  }

  get id(): string {
    return undefsafe(this, 'merchant.id')
  }

  get groupId(): string {
    return undefsafe(this, 'merchant.group_id')
  }

  get emoji(): string {
    return undefsafe(this, 'merchant.emoji')
  }

  get name(): string | undefined {
    return undefsafe(this, 'merchant.name')
  }

  get logo(): string | undefined {
    return undefsafe(this, 'merchant.logo')
  }

  public equals(merchant: IMonzoApiMerchant) {
    if (!this.id) return false
    return this.id === merchant.id
  }

  public groupEquals(merchant: IMonzoApiMerchant) {
    if (!this.groupId) return false
    return this.groupId === merchant.group_id
  }

  public toString() {
    return undefsafe(this, 'merchant.name')
  }
}
