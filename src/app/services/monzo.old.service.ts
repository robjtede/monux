import { stringify } from 'querystring'

import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'

import { MonzoRequest } from '../../lib/monzo/api'
import { getPassword } from '../../lib/keychain'

@Injectable()
export class MonzoOldService {
  private readonly proto: string = 'https://'
  private readonly apiRoot: string = 'api.monzo.com'

  private readonly accessToken: Promise<string> = getPassword({
    account: 'Monux',
    service: 'monux.monzo.access_token'
  })

  constructor(private readonly http: HttpClient) {}

  async request<T>(
    { path = '/ping/whoami', qs = {}, method = 'GET' }: MonzoRequest = {
      path: '/ping/whoami'
    }
  ): Promise<T> {
    const url = `${this.proto}${this.apiRoot}${path}`

    const headers = new HttpHeaders({
      Authorization: `Bearer ${await this.accessToken}`
    })

    const params = new HttpParams({
      fromString: stringify(qs)
    })

    if (method === 'GET') {
      return this.http
        .get<T>(url, {
          headers,
          params
        })
        .toPromise()
    } else if (method === 'POST') {
      return this.http
        .post<T>(url, params, {
          headers
        })
        .toPromise()
    } else if (method === 'PUT') {
      return this.http
        .put<T>(url, params, {
          headers
        })
        .toPromise()
    } else if (method === 'PATCH') {
      return this.http
        .patch<T>(url, params, {
          headers
        })
        .toPromise()
    } else {
      throw new Error(`Unhandled HTTP call with ${method} method.`)
    }
  }
}
