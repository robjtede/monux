import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router'
import { defer, forkJoin, iif, Observable, of, throwError } from 'rxjs'
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

    // TODO: refactor and flatten for readability
    return this.monzo.hasCode('access_token').pipe(
      switchMap(hasAccessToken =>
        iif(
          () => hasAccessToken,

          // access token exists, pass to (3)
          this.monzo.getCode('access_token'),

          // access token does not exist
          this.monzo.hasCode('refresh_token').pipe(
            switchMap(hasRefreshToken =>
              iif(
                () => hasRefreshToken,
                this.monzo.getCode('refresh_token').pipe(
                  // (2) pass new token to verify access (3)
                  switchMap(token => this.monzo.refreshAccess(token))
                ),
                throwError(new Error('token could not be refreshed'))
              )
            )
          )
        )
      ),

      // (3) recieve existing token from (1) or (2)
      // TODO: wasted verify for case where verify has succeeded
      switchMap(token => forkJoin(of(token), this.monzo.verifyAccess(token))),

      switchMap(([accessToken, accessTokenValid]) => {
        debug('access token validity =>', accessTokenValid)

        return this.monzo.hasCode('refresh_token').pipe(
          switchMap(hasRefreshToken =>
            defer(() => {
              if (accessTokenValid) {
                // new access token is valid
                return of(true)
              } else {
                // access token is invalid (likely expired)
                return iif(
                  () => hasRefreshToken,
                  this.monzo.getCode('refresh_token').pipe(
                    // attempt refresh
                    switchMap(refreshToken =>
                      this.monzo.refreshAccess(refreshToken)
                    ),

                    // receieve new token and verify
                    switchMap(accessToken =>
                      this.monzo.verifyAccess(accessToken)
                    )
                  ),
                  throwError(new Error('token could not be refreshed'))
                )
              }
            })
          )
        )
      }),

      catchError((err: Error) => {
        console.error(err)

        debug('navigating to auth request')
        this.router.navigate(['/auth-request'])

        return of(false)
      })
    )
  }
}
