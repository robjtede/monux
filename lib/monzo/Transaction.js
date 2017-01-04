'use strict'

const strftime = require('date-fns/format')

const Amount = require('./Amount')
const Merchant = require('./Merchant')

class Transaction {
  constructor (monzo, acc, tx, index = -1) {
    this.monzo = monzo
    this.acc = acc
    this.tx = tx
    this.index = index
  }

  get displayName () {
    if (this.merchant.name) return this.merchant.name
    else return this.description
  }

  get amount () {
    return new Amount(this.tx.amount, this.tx.currency)
  }

  get attachments () {
    if (!this.tx.attachments) return ''

    return this.tx.attachments.map(attachment => attachment.url)
  }

  get category () {
    let formatted = this.tx.category
    formatted = formatted.replace('_', ' ')

    return {
      raw: this.tx.category,
      formatted,
      toString: () => this.tx.category
    }
  }

  get created () {
    return this.tx.created
  }

  get declined () {
    return 'decline_reason' in this.tx
  }

  get description () {
    return this.tx.description
  }

  get icon () {
    if ('is_topup' in this.tx.metadata && this.tx.metadata.is_topup) {
      return './icons/topup.png'
    }

    if (this.tx.counterparty && 'user_id' in this.tx.counterparty) {
      return './icons/peer.png'
    }

    if (this.merchant.logo) return this.merchant.logo

    return this.iconFallback
  }

  get iconFallback () {
    return `./icons/${this.tx.category}.png`
  }

  get id () {
    return this.acc.id
  }

  get isCash () {
    return this.tx.category === 'cash'
  }

  get inSpending () {
    return this.tx.include_in_spending || false
  }

  get location () {
    if (
      this.tx.merchant &&
      'online' in this.tx.merchant &&
      this.tx.merchant.online
    ) {
      return 'Online'
    }

    if (
      this.tx.merchant &&
      'address' in this.tx.merchant &&
      this.tx.merchant.address &&
      'short_formatted' in this.tx.merchant.address &&
      this.tx.merchant.address.short_formatted
    ) {
      return this.tx.merchant.address.short_formatted
    }
  }

  get merchant () {
    return new Merchant(this.tx.merchant)
  }

  get notes () {
    return {
      toString: () => this.tx.notes,
      short: this.tx.notes.split('\n')[0],
      full: this.tx.notes
    }
  }

  get pending () {
    // declined transactions are never pending
    if (this.declined) return false

    // cash is never pending
    if (this.isCash) return false

    // all income seems to be exempt?
    if (this.tx.amount > 0) return false

    // if settled does not exists
    if (!('settled' in this.tx)) return true

    // or if settled field is empty
    if ('settled' in this.tx && !this.tx.settled.trim()) return true

    // assume transaction is not pending
    return false
  }

  get settled () {
    if (this.pending) return 'Pending'
    else return `Settled: ${strftime(new Date(this.tx.settled), 'h:mma, Do MMMM YYYY')}`
  }
}

module.exports = Transaction
