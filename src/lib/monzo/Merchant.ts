import { JSONMap } from '../json-types'

export class Merchant {
  constructor(private readonly merchant: MonzoMerchantResponse) {}

  get address(): MonzoAddressResponse {
    return this.merchant.address
  }

  get category(): string {
    return this.merchant.category
  }

  get created(): string {
    return this.merchant.created
  }

  get emoji(): string {
    return this.merchant.emoji
  }

  get groupId(): string {
    return this.merchant.group_id
  }

  get id(): string {
    return this.merchant.id
  }

  get logo(): string {
    return this.merchant.logo
  }

  get metadata(): MonzoMerchantMetadataResponse {
    return this.merchant.metadata
  }

  get name(): string {
    return this.merchant.name
  }

  equals(merchant: Merchant) {
    return this.id === merchant.id
  }

  groupEquals(merchant: Merchant) {
    return this.groupId === merchant.groupId
  }

  get json(): MonzoMerchantResponse {
    return this.merchant
  }

  get stringify(): string {
    return JSON.stringify(this.json)
  }

  toString() {
    return this.name
  }
}

export interface MonzoMerchantResponse extends JSONMap {
  address: MonzoAddressResponse
  atm: boolean
  // TODO: category enum
  category: string
  created: string
  disable_feedback: boolean
  emoji: string
  group_id: string
  id: string
  logo: string
  metadata: MonzoMerchantMetadataResponse
  name: string
  online: boolean
}

export interface MonzoAddressResponse extends JSONMap {
  address: string
  approximate: boolean
  city: string
  country: string
  formatted: string
  latitude: number
  longitude: number
  postcode: string
  region: string
  short_formatted: string
  zoom_level: number
}

export interface MonzoMerchantMetadataResponse extends JSONMap {
  created_for_merchant: string
  created_for_transaction: string
  foursquare_category: string
  foursquare_category_icon: string
  foursquare_id: string
  foursquare_website: string
  google_places_icon: string
  google_places_id: string
  google_places_name: string
  provider: string
  provider_id: string
  suggested_name: string
  suggested_tags: string
  twitter_id: string
  website: string
}
