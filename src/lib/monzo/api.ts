import { HttpHeaders } from '@angular/common/http'
import * as rp from 'request-promise-native'
import { Primitive } from 'json-types'

type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS'

export interface QueryString {
  [key: string]: Primitive | undefined
}

export interface MonzoRequest {
  path: string
  qs?: QueryString
  method?: HttpMethods
  json?: boolean
  headers?: HttpHeaders
}

export class MonzoApi {
  private proto: string = 'https://'
  private apiRoot: string = 'api.monzo.com'

  constructor(private accessResponse: string) {}

  public request(
    {
      path = '/ping/whoami',
      qs = {},
      method = 'GET',
      json = true
    }: MonzoRequest = { path: '/ping/whoami' }
  ) {
    const headers = {
      Authorization: `Bearer ${this.accessResponse}`
    }

    const opts = {
      method,
      uri: `${this.proto}${this.apiRoot}${path}`,
      [method === 'GET' ? 'qs' : 'form']: qs,
      headers,
      json
    }

    return rp(opts)
  }
}

export interface MonzoWhoAmIResponse {
  authenticated: boolean
  client_id: string
  user_id: string
}

export interface MonzoRefreshAccessResponse {
  access_token: string
  client_id: string
  expires_in: number
  refresh_token: string
  token_type: string
  user_id: string
}
