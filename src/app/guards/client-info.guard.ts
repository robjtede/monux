import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router'
import { combineLatest, of, Observable } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import Debug = require('debug')

import { MonzoService } from '../services/monzo.service'

const debug = Debug('app:guard:client-info')

@Injectable()
export class ClientInfoGuard implements CanActivate {
  constructor(private monzo: MonzoService, private router: Router) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> {
    debug('checking existence of client info')

    return combineLatest(
      this.monzo.getCode('client_id'),
      this.monzo.getCode('client_secret')
    ).pipe(
      map(([id, secret]) => !!id && !!secret),
      catchError((err: Error) => {
        console.error(err.message)

        debug('navigating to client info entry')
        this.router.navigate(['/get-client-info'])

        return of(false)
      })
    )
  }
}
