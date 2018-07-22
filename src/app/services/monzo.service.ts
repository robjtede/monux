import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import Debug = require('debug')
import { forkJoin, Observable, of, throwError } from 'rxjs'
import { switchMap, map, tap, catchError } from 'rxjs/operators'

import {
  MonzoAccessResponse,
  MonzoRequest,
  MonzoWhoAmIResponse
} from 'monzolib'
import { stringify } from 'querystring'

import {
  Keychain,
  KeychainService,
  MonzoSavableCodes
} from './keychain.service'

const debug = Debug('app:service:monzo')

@Injectable()
export class MonzoService {
  private readonly proto: string = 'https://'
  private readonly apiRoot: string = 'api.monzo.com'

  constructor(private keychain: KeychainService, private http: HttpClient) {}

  getAccessToken(): Observable<string> {
    return this.getCode('access_token')
  }

  hasCode(code: keyof MonzoSavableCodes): Observable<boolean> {
    debug('checking code existence =>', code)

    return this.keychain.getKeychain().pipe(
      map(chain => {
        return !!(
          chain &&
          chain.accounts &&
          chain.accounts.monzo &&
          chain.accounts.monzo[code]
        )
      })
    )
  }

  getCode(code: keyof MonzoSavableCodes): Observable<string> {
    debug('getting code =>', code)

    return this.keychain.getKeychain().pipe(
      switchMap(chain => {
        return forkJoin(of(chain), this.hasCode(code))
      }),
      map(([chain, codeExists]) => {
        if (codeExists) {
          return (chain as any).accounts.monzo[code] as string
        } else {
          throw new Error(`monzo.${code} is not saved`)
        }
      })
    )
  }

  saveCode(code: string, value: string | undefined): Observable<void> {
    debug('saving code =>', code)

    return this.keychain.hasKeychain().pipe(
      switchMap(hasKeychain => {
        debug('has keychain', hasKeychain)
        return hasKeychain ? this.keychain.getKeychain() : of({} as Keychain)
      }),
      switchMap(chain => {
        debug('current keychain', chain)
        const newChain = {
          ...chain,
          accounts: {
            ...(chain.accounts ? chain.accounts : {}),
            monzo: {
              ...(chain.accounts && chain.accounts.monzo
                ? chain.accounts.monzo
                : {}),
              [code]: value
            }
          }
        }

        debug('modified keychain', newChain)
        return this.keychain.overwriteKeychain(newChain)
      })
    )
  }

  deleteCode(code: string): Observable<void> {
    debug('deleting code =>', code)

    return this.saveCode(code, undefined)
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
        tap(res => debug('whoami response =>', res)),
        map(res => res.authenticated),
        catchError(err => {
          if (err.status && err.status === 401) {
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
      this.getCode('client_id'),
      this.getCode('client_secret')
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
        return forkJoin(
          this.saveCode('access_token', access_token),
          // conditional not assuming existence of refresh token
          refresh_token
            ? this.saveCode('refresh_token', refresh_token)
            : of(undefined)
        )
      }),
      switchMap(() => {
        return this.getAccessToken()
      })
    )
  }

  request<T>(
    { path = '/ping/whoami', qs = {}, method = 'GET' }: MonzoRequest = {
      path: '/ping/whoami'
    }
  ): Observable<T> {
    const url = `${this.proto}${this.apiRoot}${path}`

    return this.getAccessToken().pipe(
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
