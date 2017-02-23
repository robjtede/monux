'use strict'

const strftime = require('date-fns').format

const Amount = require('./Amount')
const Merchant = require('./Merchant')

class Transaction {
  constructor (monzo, acc, tx, index = -1) {
    this.monzo = monzo
    this.acc = acc
    this.tx = tx
    this.index = index
  }

  get amount () {
    let opts = {
      raw: this.tx.amount,
      currency: this.tx.currency
    }

    // if foreign currency
    if (this.tx.local_currency !== this.tx.currency) {
      opts = Object.assign(opts, {
        localRaw: this.tx.local_amount,
        localCurrency: this.tx.local_currency
      })
    }

    return new Amount(opts)
  }

  annotate (key, val) {
    return this.monzo
      .request(`/transactions/${this.id}`, {
        [`metadata[${key}]`]: val
      }, 'PATCH')
      .catch(err => console.error(err))
  }

  get attachments () {
    if (!this.tx.attachments) return ''

    return this.tx.attachments.map(attachment => attachment.url)
  }

  requestAttachmentUpload (contentType = 'image/jpeg') {
    return this.monzo
      .request('/attachment/upload', {
        file_name: 'monux-attachment.jpg',
        file_type: contentType
      }, 'POST')
  }

  registerAttachment (fileUrl, contentType = 'image/jpeg') {
    return this.monzo
      .request('/attachment/register', {
        external_id: this.tx.id,
        file_url: fileUrl,
        file_type: contentType
      }, 'POST')
  }

  get balance () {
    const opts = {
      raw: this.tx.account_balance,
      currency: this.tx.currency
    }

    return new Amount(opts)
  }

  get category () {
    let raw = this.tx.category
    raw = raw.replace('mondo', 'monzo')

    let formatted = raw
    formatted = formatted.replace('_', ' ')

    return {
      raw,
      formatted,
      toString: () => raw
    }
  }

  get created () {
    return new Date(this.tx.created)
  }

  get declined () {
    return 'decline_reason' in this.tx
  }

  get declineReason () {
    return this.declined ? this.tx.decline_reason.replace('_', ' ').toLowerCase() : ''
  }

  get description () {
    return this.tx.description
  }

  get displayName () {
    if (this.merchant.name) return this.merchant.name
    else return this.description
  }

  get hidden () {
    if ('monux_hidden' in this.tx.metadata) {
      return this.tx.metadata.monux_hidden !== 'false'
    } else return false
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
    return this.tx.id
  }

  get is () {
    const cash = this.tx.category === 'cash'
    const zero = +this.tx.amount === 0

    const metaAction = zero && !this.inSpending

    return {
      metaAction,
      cash,
      zero
    }
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

  setNotes (val) {
    return this.annotate('notes', val)
      .then(val => {
        this.tx.notes = val.transaction.notes
      })
  }

  get online () {
    if (
      this.tx.merchant &&
      'online' in this.tx.merchant
    ) return this.tx.merchant.online || false
  }

  get pending () {
    // declined transactions are never pending
    if (this.declined) return false

    // cash is never pending
    if (this.is.cash) return false

    // all income and zero amounts seems to be exempt
    // could change when currect accounts release
    if (this.tx.amount >= 0) return false

    // if settled does not exists
    if (!('settled' in this.tx)) return true

    // or if settled field is empty
    if ('settled' in this.tx && !this.tx.settled.trim()) return true

    // assume transaction is not pending
    return false
  }

  get settled () {
    if (this.pending) return 'Pending'
    else return `Settled: ${strftime(new Date(this.tx.settled), 'h:mma - Do MMMM YYYY')}`
  }
}

module.exports = Transaction
