import { Injectable } from '@angular/core'
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router'
import { Observable, forkJoin, iif, of, throwError } from 'rxjs'
import { catchError, map, switchMap, switchMapTo, tap } from 'rxjs/operators'
import Debug = require('debug')

import { MonzoService } from '../services/monzo.service'

const debug = Debug('app:guard:api-access')

@Injectable()
export class ApiAccessGuard implements CanActivate {
  constructor(
    private monzo: MonzoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> {
    debug('checking access token validity')

    // TODO: refactor and flatten for readability
    return this.monzo.hasCode('access_token').pipe(
      switchMap(hasAccessToken =>
        iif(
          () => hasAccessToken,

          // access token exists, pass to (3)
          this.monzo.getCode('access_token').pipe(tap(console.log)),

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

      switchMap(([accessToken, accessTokenValid]) =>
        this.monzo.hasCode('refresh_token').pipe(
          switchMap(hasRefreshToken =>
            iif(
              () => accessTokenValid,

              // (4) new access token is valid, pass to verify access (6)
              of(accessToken),

              iif(
                () => hasRefreshToken,
                this.monzo.getCode('refresh_token').pipe(
                  // (5) pass new token to verify access (6)
                  switchMap(token => this.monzo.refreshAccess(token))
                ),
                throwError(new Error('token could not be refreshed'))
              )
            )
          )
        )
      ),

      // (6) receieve new token from (4) or (5) and verify
      switchMap(token => this.monzo.verifyAccess(token)),
      catchError((err: Error) => {
        console.error(err.message)

        debug('navigating to auth request')
        this.router.navigate(['/auth-request'])

        return of(false)
      })
    )
  }
}
