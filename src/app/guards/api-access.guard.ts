import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router'
import { defer, Observable, from, of, throwError } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import Debug = require('debug')

import { MonzoService } from '../services/monzo.service'

const debug = Debug('app:guard:api-access')

@Injectable()
export class ApiAccessGuard implements CanActivate {
  constructor(private monzo: MonzoService, private router: Router) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> {
    debug('checking API access')

    return from(this.monzo.hasCode('access_token')).pipe(
      switchMap(hasAccessToken => {
        if (hasAccessToken) {
          // access token exists
          return this.monzo.getCode('access_token')
        } else {
          // access token does not exist
          return this.refreshAccess()
        }
      }),

      // TODO: wasted verify for case where refresh has succeeded
      switchMap(token => this.monzo.verifyAccess(token)),

      switchMap(accessTokenValid => {
        debug('access token validity =>', accessTokenValid)

        if (accessTokenValid) {
          return of(true)
        } else {
          return this.refreshAccess()
        }
      }),

      catchError((err: Error) => {
        console.error(err)

        debug('navigating to auth request')
        this.router.navigate(['/auth-request'])

        return of(false)
      })
    )
  }

  refreshAccess(): Observable<string> {
    return from(this.monzo.hasCode('refresh_token')).pipe(
      switchMap(hasRefreshToken =>
        defer(() => {
          if (hasRefreshToken) {
            return from(this.monzo.getCode('refresh_token')).pipe(
              switchMap(token => this.monzo.refreshAccess(token))
            )
          } else {
            return throwError(new Error('token could not be refreshed'))
          }
        })
      )
    )
  }
}
