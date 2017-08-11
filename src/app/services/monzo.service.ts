import { stringify } from 'querystring'

import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import 'rxjs/add/operator/toPromise'

import { MonzoRequest } from '../../lib/monzo/api'
import { getPassword } from '../../lib/keychain'

@Injectable()
export class MonzoService {
  private proto: string = 'https://'
  private apiRoot: string = 'api.monzo.com'

  private accessResponse: Promise<string> = getPassword({
    account: 'Monux',
    service: 'monux.monzo.access_token'
  })

  constructor(private http: HttpClient) {}

  async request(
    {
      path = '/ping/whoami',
      qs = {},
      method = 'GET',
      json = true
    }: MonzoRequest = { path: '/ping/whoami' }
  ) {
    const url = `${this.proto}${this.apiRoot}${path}`

    const headers = new HttpHeaders({
      Authorization: `Bearer ${await this.accessResponse}`
    })

    const params = new HttpParams({
      fromString: stringify(qs)
    })

    if (method === 'GET') {
      return this.http
        .get(url, {
          headers,
          params
        })
        .toPromise()
    } else if (method === 'POST') {
      console.error(`Unhandled HTTP call with ${method} method.`)
      throw new Error(`Unhandled HTTP call with ${method} method.`)
    } else if (method === 'PUT') {
      console.error(`Unhandled HTTP call with ${method} method.`)
      throw new Error(`Unhandled HTTP call with ${method} method.`)
    } else if (method === 'PATCH') {
      console.error(`Unhandled HTTP call with ${method} method.`)
      throw new Error(`Unhandled HTTP call with ${method} method.`)
    } else {
      console.error(`Unhandled HTTP call with ${method} method.`)
      throw new Error(`Unhandled HTTP call with ${method} method.`)
    }
  }
}
