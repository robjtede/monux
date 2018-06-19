import { Injectable } from '@angular/core'
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router'
import { combineLatest, of } from 'rxjs'
import { map, tap, catchError } from 'rxjs/operators'
import Debug = require('debug')

import { MonzoService } from '../services/monzo.service'

const debug = Debug('app:guard:client-info')

@Injectable()
export class ClientInfoGuard implements CanActivate {
  constructor(private monzo: MonzoService, private router: Router) {}

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    debug('checking acitvation')

    return combineLatest(
      this.monzo.getSavedCode('client_id'),
      this.monzo.getSavedCode('client_secret')
    ).pipe(
      map(([id, secret]) => !!id && !!secret),
      catchError((err: Error) => {
        debug(err.message)
        this.router.navigate(['/get-client-info'])
        return of(false)
      })
    )
  }
}
