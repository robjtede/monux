import { Injectable } from '@angular/core'
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot
} from '@angular/router'
import { of } from 'rxjs'
import { map, tap, catchError } from 'rxjs/operators'
import Debug = require('debug')

import { MonzoService } from '../services/monzo.service'

const debug = Debug('app:guard:api-access')

@Injectable()
export class ApiAccessGuard implements CanActivate, CanActivateChild {
  constructor(
    private monzo: MonzoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    debug('checking acitvation')

    return this.monzo.getSavedCode('access_token').pipe(
      // needs switchmap to check validity
      map(code => !!code),
      catchError((err: Error) => {
        debug(err.message)
        this.router.navigate(['auth-request'])
        return of(false)
      })
    )
  }

  canActivateChild(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ) {
    debug('checking child activation')
    return true
  }
}
