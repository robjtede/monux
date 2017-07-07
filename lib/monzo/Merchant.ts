export interface IMonzoApiMerchant {
  id: string
  group_id: string
  [propName: string]: any
}

export default class Merchant {
  private merchant: IMonzoApiMerchant

  constructor(merchant: IMonzoApiMerchant) {
    this.merchant = merchant
  }

  get id(): string {
    if (this.merchant && 'id' in this.merchant) {
      return this.merchant.id
    } else {
      return ''
    }
  }

  get groupId(): string {
    if (this.merchant && 'group_id' in this.merchant) {
      return this.merchant.group_id
    } else {
      return ''
    }
  }

  get emoji(): string {
    if (this.merchant && 'emoji' in this.merchant) {
      return this.merchant.emoji
    } else {
      return ''
    }
  }

  get name(): string {
    if (this.merchant && 'name' in this.merchant) {
      return this.merchant.name
    } else {
      return ''
    }
  }

  get logo(): string {
    if (this.merchant && 'logo' in this.merchant) {
      return this.merchant.logo
    } else {
      return ''
    }
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
    return this.name
  }
}
