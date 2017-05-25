export interface IMonzoApiMerchant {
  id: string,
  group_id: string,
  [propName:string]: any
}

export default class Merchant {
  private merchant: IMonzoApiMerchant
  
  private id: string
  private groupId: string
  
  constructor(merchant: IMonzoApiMerchant) {
    this.merchant = merchant
    
    this.id = this.merchant.id
    this.groupId = this.merchant.group_id
  }

  get emoji(): string {
    if (this.merchant) return this.merchant.emoji
    else return ''
  }

  get name(): string {
    if (this.merchant && this.merchant.name) {
      return this.merchant.name
    }
    
    return ''
  }

  get logo(): string {
    if (
      this.merchant &&
      'logo' in this.merchant &&
      this.merchant.logo
    ) {
      return this.merchant.logo
    }
    
    return ''
  }

  equals(merchant: IMonzoApiMerchant) {
    if (!this.id) return false
    return this.id === merchant.id
  }

  groupEquals(merchant: IMonzoApiMerchant) {
    if (!this.groupId) return false
    return this.groupId === merchant.group_id
  }

  toString() {
    return this.merchant.name || ''
  }
}
