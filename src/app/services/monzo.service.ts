import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import Debug = require('debug')
import { forkJoin, Observable, of, from, throwError } from 'rxjs'
import { switchMap, map, catchError } from 'rxjs/operators'
import { has, get, set, cloneDeep } from 'lodash'

import {
  MonzoAccessResponse,
  MonzoRequest,
  MonzoWhoAmIResponse
} from 'monzolib'
import { stringify } from 'querystring'

import { KeychainService, MonzoSavableCodes } from './keychain.service'

const debug = Debug('app:service:monzo')

@Injectable()
export class MonzoService {
  private readonly proto: string = 'https://'
  private readonly apiRoot: string = 'api.monzo.com'

  constructor(private keychain: KeychainService, private http: HttpClient) {}

  getAccessToken(): Promise<string> {
    return this.getCode('access_token')
  }

  async hasCode(code: MonzoSavableCodes) {
    debug('checking code existence =>', code)
    const chain = await this.keychain.getKeychain()
    return !!get(chain, ['accounts', 'monzo', code])
  }

  async getCode(code: MonzoSavableCodes): Promise<string> {
    debug('getting code =>', code)
    const chain = await this.keychain.getKeychain()

    if (has(chain, ['accounts', 'monzo', code])) {
      return (chain as any).accounts.monzo[code] as string
    } else {
      throw new Error(`monzo.${code} is not saved`)
    }
  }

  async saveCode(
    code: MonzoSavableCodes,
    value: string | undefined
  ): Promise<void> {
    debug('saving code =>', code)

    const hasKeychain = await this.keychain.keychainExists()
    debug('has keychain', hasKeychain)

    const chain = hasKeychain ? await this.keychain.getKeychain() : {}
    debug('current keychain', chain)

    const newChain = set(cloneDeep(chain), ['accounts', 'monzo', code], value)
    debug('modified keychain', newChain)

    return this.keychain.overwriteKeychain(newChain)
  }

  deleteCode(code: MonzoSavableCodes): Promise<void> {
    debug('deleting code =>', code)
    return this.saveCode(code, undefined)
  }

  getAccess(tokenRequest: MonzoRequest): Observable<boolean> {
    return this.request<MonzoAccessResponse>(tokenRequest, false).pipe(
      switchMap(({ access_token, refresh_token }) => {
        debug('saving token(s) after auth')
        return from(this.saveCode('access_token', access_token)).pipe(
          switchMap(() => this.saveCode('refresh_token', refresh_token))
        )
      }),
      map(() => {
        debug('saved token(s)')
        return true
      }),
      catchError(err => {
        debug('failed to save token(s)')
        console.error(err)
        return of(false)
      })
    )
  }

  verifyAccess(accessToken: string): Observable<boolean> {
    debug('verifying access token (whoami)')

    const path = `${this.proto}${this.apiRoot}/ping/whoami`
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    })

    return this.http
      .get<MonzoWhoAmIResponse>(path, {
        headers
      })
      .pipe(
        map(res => {
          debug('whoami response =>', res)
          return res.authenticated
        }),
        catchError(err => {
          if (err && err.status === 401) {
            debug('access token expired')
            return of(false)
          }

          return throwError(err)
        })
      )
  }

  // assumes existence of refresh token
  // returns new access token
  refreshAccess(refresh_token: string): Observable<string> {
    debug('refreshing access token')

    return forkJoin(
      from(this.getCode('client_id')),
      from(this.getCode('client_secret'))
    ).pipe(
      switchMap(([client_id, client_secret]) => {
        const url = `${this.proto}${this.apiRoot}/oauth2/token`
        const params = new HttpParams({
          fromObject: {
            grant_type: 'refresh_token',
            client_id,
            client_secret,
            refresh_token
          }
        })

        return this.http.post<MonzoAccessResponse>(url, params)
      }),
      switchMap(({ access_token, refresh_token }) => {
        debug('saving token(s) after refresh')
        return from(this.saveCode('access_token', access_token)).pipe(
          switchMap(() => this.saveCode('refresh_token', refresh_token))
        )
      }),
      switchMap(() => {
        return from(this.getAccessToken())
      })
    )
  }

  request<T>(
    { path = '/ping/whoami', qs = {}, body = {}, method = 'GET' }: MonzoRequest,
    withToken = true
  ): Observable<T> {
    const debug = Debug(`app:monzo:request:${path}`)
    debug('making request', !withToken ? 'without token' : '')

    const url = `${this.proto}${this.apiRoot}${path}`

    return (withToken ? from(this.getAccessToken()) : of(undefined)).pipe(
      switchMap(token => {
        let headers = new HttpHeaders()

        if (withToken) {
          headers = headers.set('Authorization', `Bearer ${token}`)
        }

        const params = new HttpParams({
          fromString: stringify(qs)
        })

        const data = new HttpParams({
          fromString: stringify(body)
        })

        debug('using', { params, data, headers })

        if (method === 'GET') {
          return this.http.get<T>(url, {
            headers,
            params
          })
        } else if (method === 'POST') {
          return this.http.post<T>(url, data, {
            headers,
            params
          })
        } else if (method === 'PUT') {
          return this.http.put<T>(url, data, {
            headers,
            params
          })
        } else if (method === 'PATCH') {
          return this.http.patch<T>(url, data, {
            headers,
            params
          })
        } else {
          throw new Error(`Unhandled HTTP call with ${method} method.`)
        }
      })
    )
  }
}
