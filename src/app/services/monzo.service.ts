import { switchMap } from 'rxjs/operators'
import { stringify } from 'querystring'

import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable, from } from 'rxjs'

import { MonzoRequest } from '../../lib/monzo/api'
import { getPassword } from '../../lib/keychain'

@Injectable()
export class MonzoService {
  private readonly proto: string = 'https://'
  private readonly apiRoot: string = 'api.monzo.com'

  private accessToken: Promise<string> = getPassword({
    account: 'Monux',
    service: 'monux.monzo.access_token'
  })

  constructor(private readonly http: HttpClient) {}

  request<T>(
    { path = '/ping/whoami', qs = {}, method = 'GET' }: MonzoRequest = {
      path: '/ping/whoami'
    }
  ): Observable<T> {
    const url = `${this.proto}${this.apiRoot}${path}`

    return from(this.accessToken).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`
        })

        const params = new HttpParams({
          fromString: stringify(qs)
        })

        if (method === 'GET') {
          return this.http.get<T>(url, {
            headers,
            params
          })
        } else if (method === 'POST') {
          return this.http.post<T>(url, params, {
            headers
          })
        } else if (method === 'PUT') {
          return this.http.put<T>(url, params, {
            headers
          })
        } else if (method === 'PATCH') {
          return this.http.patch<T>(url, params, {
            headers
          })
        } else {
          throw new Error(`Unhandled HTTP call with ${method} method.`)
        }
      })
    )
  }
}
