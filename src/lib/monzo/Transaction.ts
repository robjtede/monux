import { format } from 'date-fns'

import Amount, { SimpleAmount } from './Amount'
import Merchant, { MonzoMerchantResponse } from './Merchant'
import { JSONMap } from '../json-types'
import { MonzoRequest } from './api'

export default class Transaction {
  constructor(private readonly tx: MonzoTransactionResponse) {}

  get amount(): Amount {
    const native: SimpleAmount = {
      amount: this.tx.amount,
      currency: this.tx.currency
    }

    // if foreign currency
    if (this.tx.currency !== this.tx.local_currency) {
      const local: SimpleAmount = {
        amount: this.tx.local_amount,
        currency: this.tx.local_currency
      }

      return new Amount({ native, local })
    } else {
      return new Amount({ native })
    }
  }

  get attachments(): MonzoAttachmentResponse[] {
    return this.tx.attachments
  }

  get balance(): Amount {
    const native: SimpleAmount = {
      amount: this.tx.account_balance,
      currency: this.tx.currency
    }

    return new Amount({ native })
  }

  get category() {
    let raw = this.tx.category
    raw = raw.replace('mondo', 'monzo')

    let formatted = raw
    formatted = formatted.replace('_', ' ')

    return {
      raw,
      formatted,
      toString: (): string => raw
    }
  }

  get counterparty() {
    return this.tx.counterparty
  }

  get created(): Date {
    return new Date(this.tx.created)
  }

  get declined(): boolean {
    return 'decline_reason' in this.tx
  }

  get declineReason(): string {
    return this.declined
      ? this.tx.decline_reason.replace('_', ' ').toLowerCase()
      : ''
  }

  get description(): string {
    return this.tx.description
  }

  get displayName(): string {
    return typeof this.merchant !== 'string' && this.merchant.name
      ? this.merchant.name
      : this.description
  }

  get hidden(): boolean {
    return 'monux_hidden' in this.tx.metadata
      ? this.tx.metadata.monux_hidden === 'true'
      : false
  }

  get icon(): string {
    if ('is_topup' in this.tx.metadata && this.tx.metadata.is_topup) {
      return './icons/topup.png'
    }

    if (this.tx.counterparty && 'user_id' in this.tx.counterparty) {
      return './icons/peer.png'
    }

    if (typeof this.merchant !== 'string' && this.merchant.logo) {
      return this.merchant.logo
    }

    return this.iconFallback
  }

  get iconFallback(): string {
    return `./icons/${this.category}.png`
  }

  get id(): string {
    return this.tx.id
  }

  get is() {
    const cash = String(this.category) === 'cash'
    const zero = +this.tx.amount === 0

    const metaAction = zero && !this.inSpending

    return {
      metaAction,
      cash,
      zero
    }
  }

  get inSpending(): boolean {
    return this.tx.include_in_spending || false
  }

  get location(): string {
    if (
      'merchant' in this.tx &&
      typeof this.tx.merchant !== 'string' &&
      this.tx.merchant &&
      'online' in this.tx.merchant
    ) {
      return 'Online'
    } else if (
      'merchant' in this.tx &&
      typeof this.tx.merchant !== 'string' &&
      this.tx.merchant &&
      'address' in this.tx.merchant &&
      this.tx.merchant.address &&
      'short_formatted' in this.tx.merchant
    ) {
      return this.tx.merchant.address.short_formatted
    } else {
      return ''
    }
  }

  get merchant(): Merchant | string {
    return typeof this.tx.merchant !== 'string'
      ? new Merchant(this.tx.merchant)
      : this.tx.merchant
  }

  get notes() {
    return {
      toString: () => this.tx.notes,
      short: this.tx.notes.split('\n')[0],
      full: this.tx.notes
    }
  }

  get online(): boolean {
    return (
      'merchant' in this.tx &&
      typeof this.tx.merchant !== 'string' &&
      this.tx.merchant &&
      'online' in this.tx.merchant &&
      this.tx.merchant.online
    )
  }

  get pending(): boolean {
    // declined transactions are never pending
    if (this.declined) return false

    // cash is never pending
    if (this.is.cash) return false

    // all income and zero amounts seems to be exempt
    // NOTE: could change when current accounts release
    if (this.tx.amount >= 0) return false

    // if settled does not exists
    if (!('settled' in this.tx)) return true

    // or if settled field is empty
    if ('settled' in this.tx && !this.tx.settled.trim()) return true

    // assume transaction is not pending
    return false
  }

  get settled(): string {
    if (this.pending) return 'Pending'
    else {
      return `Settled: ${format(
        new Date(this.tx.settled),
        'h:mma - Do MMMM YYYY'
      )}`
    }
  }

  annotateRequest(key: string, val: string | number): MonzoRequest {
    const metaKey = `metadata[${key}]`

    return {
      path: `/transactions/${this.id}`,
      qs: {
        [metaKey]: val
      },
      method: 'PATCH'
    }
  }

  setNotesRequest(val: string): MonzoRequest {
    return this.annotateRequest('notes', val)
  }

  attachmentUploadRequest(contentType = 'image/jpeg'): MonzoRequest {
    return {
      path: '/attachment/upload',
      qs: {
        file_name: 'monux-attachment.jpg',
        file_type: contentType
      },
      method: 'POST'
    }
  }

  attachmentRegisterRequest(
    fileUrl: string,
    contentType = 'image/jpeg'
  ): MonzoRequest {
    return {
      path: '/attachment/register',
      qs: {
        external_id: this.tx.id,
        file_url: fileUrl,
        file_type: contentType
      },
      method: 'POST'
    }
  }

  deregisterAttachmentRequest(attachmentId: string): MonzoRequest {
    return {
      path: '/attachment/deregister',
      qs: {
        id: attachmentId
      },
      method: 'POST'
    }
  }

  get json(): MonzoTransactionResponse {
    return this.tx
  }

  get stringify(): string {
    return JSON.stringify(this.json)
  }
}

export interface MonzoTransactionResponse extends JSONMap {
  account_balance: number
  account_id: string
  amount: number
  attachments: MonzoAttachmentResponse[]
  // TODO: category enum
  category: string
  counterparty: MonzoCounterpartyResponse
  created: string
  // TODO: full currency code list
  currency: string
  decline_reason: string
  dedupe_id: string
  description: string
  id: string
  include_in_spending: boolean
  is_load: boolean
  local_amount: number
  // TODO: full currency code list
  local_currency: string
  merchant: string | MonzoMerchantResponse
  metadata: JSONMap
  notes: string
  originator: false
  scheme: string
  settled: string
  updated: string
}

export interface MonzoAttachmentResponse extends JSONMap {
  created: string
  external_id: string
  // TODO: full mime-type list
  file_type: string
  file_url: string
  id: string
  // TODO: full mime-type list
  type: string
  url: string
  user_id: string
}

export interface MonzoCounterpartyResponse extends JSONMap {
  name: string
  number: string
  prefered_name: string
  user_id: string
}
