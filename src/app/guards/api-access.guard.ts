import { Injectable } from '@angular/core'
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router'
import { of } from 'rxjs'
import { catchError, map, switchMap, tap } from 'rxjs/operators'
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

    return this.monzo.getCode('access_token').pipe(
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
