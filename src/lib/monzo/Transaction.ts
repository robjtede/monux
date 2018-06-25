import { format } from 'date-fns'
import { Primitive, JSONMap } from 'json-types'

import { Amount } from './Amount'
import { Attachment, MonzoAttachmentResponse } from './Attachment'
import { Merchant, MonzoMerchantResponse } from './Merchant'
import { MonzoRequest } from './api'

export class Transaction {
  constructor(private readonly tx: MonzoTransactionResponse) {}

  get amount(): Amount {
    const native = {
      amount: this.tx.amount,
      currency: this.tx.currency
    }

    // if foreign currency
    if (this.tx.currency !== this.tx.local_currency) {
      const local = {
        amount: this.tx.local_amount,
        currency: this.tx.local_currency
      }

      return new Amount({ native, local })
    } else {
      return new Amount({ native })
    }
  }

  get attachments(): Attachment[] {
    if (this.tx.attachments) {
      return this.tx.attachments.map(att => new Attachment(att))
    } else {
      return []
    }
  }

  get balance(): Amount {
    const native = {
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

  get counterparty(): MonzoCounterpartyResponse {
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
    if (
      this.merchant &&
      typeof this.merchant !== 'string' &&
      this.merchant.name
    ) {
      return this.merchant.name
    } else if (this.is.pot) {
      // TODO: get proper description for pot
      return 'Added to Pot'
    } else {
      return this.description
    }
  }

  get hidden(): boolean {
    return 'monux_hidden' in this.tx.metadata
      ? this.tx.metadata.monux_hidden === 'true'
      : false
  }

  get icon(): string {
    if ('is_topup' in this.tx.metadata && this.tx.metadata.is_topup) {
      return './assets/icons/topup.png'
    }

    if (this.tx.counterparty && 'user_id' in this.tx.counterparty) {
      return './assets/icons/peer.png'
    }

    if (
      typeof this.merchant !== 'string' &&
      this.merchant &&
      'logo' in this.merchant &&
      this.merchant.logo
    ) {
      return this.merchant.logo
    }

    return this.iconFallback
  }

  get iconFallback(): string {
    return `./assets/icons/${this.category}.png`
  }

  get id(): string {
    return this.tx.id
  }

  get is() {
    const cash = String(this.category) === 'cash'
    const zero = this.tx.amount === 0

    const metaAction = zero && !this.inSpending
    const pot = this.tx.scheme === 'uk_retail_pot'

    return {
      metaAction,
      cash,
      zero,
      pot
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
      'online' in this.tx.merchant &&
      this.tx.merchant.online
    ) {
      return 'Online'
    } else if (
      'merchant' in this.tx &&
      typeof this.tx.merchant !== 'string' &&
      this.tx.merchant &&
      'address' in this.tx.merchant &&
      this.tx.merchant.address &&
      'short_formatted' in this.tx.merchant.address &&
      this.tx.merchant.address.short_formatted
    ) {
      return this.tx.merchant.address.short_formatted
    } else {
      return ''
    }
  }

  get merchant(): Merchant | string | undefined {
    if (!this.tx.merchant) return undefined
    if (typeof this.tx.merchant === 'string') return this.tx.merchant
    return new Merchant(this.tx.merchant)
  }

  get notes() {
    const notes = this.tx.notes.replace('%2B', '+')

    return {
      short: notes.split('\n')[0],
      full: notes,
      toString: () => notes
    }
  }

  get online(): boolean {
    return (
      !!this.tx.merchant &&
      typeof this.tx.merchant !== 'string' &&
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

  selfRequest(): MonzoRequest {
    return {
      path: `/transactions/${this.id}`,
      qs: {
        'expand[]': 'merchant'
      }
    }
  }

  annotateRequest(key: string, val: Primitive): MonzoRequest {
    const metaKey = `metadata[${key}]`

    return {
      path: `/transactions/${this.id}`,
      qs: {
        [metaKey]: typeof val === 'string' ? val.replace('+', '%2B') : val
      },
      method: 'PATCH'
    }
  }

  setNotesRequest(val: string): MonzoRequest {
    return this.annotateRequest('notes', val)
  }

  hideRequest(): MonzoRequest {
    return this.annotateRequest('monux_hidden', 'true')
  }

  unhideRequest(): MonzoRequest {
    return this.annotateRequest('notes', '')
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
  // TODO: this could be undefined
  decline_reason: string
  dedupe_id: string
  description: string
  id: string
  include_in_spending: boolean
  is_load: boolean
  local_amount: number
  // TODO: full currency code list
  local_currency: string
  merchant: MonzoMerchantResponse | string | null
  metadata: JSONMap
  notes: string
  originator: false
  scheme: string
  settled: string
  updated: string
}

export interface MonzoTransactionOuterResponse extends JSONMap {
  transaction: MonzoTransactionResponse
}

export interface MonzoTransactionsResponse extends JSONMap {
  transactions: MonzoTransactionResponse[]
}

export interface MonzoCounterpartyResponse extends JSONMap {
  name: string
  number: string
  prefered_name: string
  user_id: string
}

export interface TransactionRequestOpts {
  since?: Date | string
  before?: Date
  limit?: number
}
