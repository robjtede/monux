'use strict'

class Merchant {
  constructor (merchant) {
    this.merchant = merchant
  }

  get emoji () {
    if (this.merchant) return this.merchant.emoji
    else return ''
  }

  get name () {
    if (this.merchant && this.merchant.name) {
      return this.merchant.name
    }
  }

  get logo () {
    if (
      this.merchant &&
      'logo' in this.merchant &&
      this.merchant.logo
    ) {
      return this.merchant.logo
    }
  }

  equals (merchant) {
    if (!this.id) return false
    return this.id === merchant.id
  }

  groupEquals (merchant) {
    if (!this.group_id) return false
    return this.group_id === merchant.group_id
  }

  toString () {
    return this.merchant.name || ''
  }
}

module.exports = Merchant
