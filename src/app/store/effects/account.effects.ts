import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Store, Action } from '@ngrx/store'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { defer, from, Observable, of } from 'rxjs'
import {
  catchError,
  map,
  switchMap,
  switchMapTo,
  mapTo,
  tap
} from 'rxjs/operators'

import { MonzoService } from '../../services/monzo.service'
import {
  accountsRequest,
  Account,
  MonzoAccountsResponse
} from '../../../lib/monzo/Account'

import { AppState } from '../'
import {
  GET_ACCOUNT,
  SetAccountAction,
  GetAccountAction,
  GetAccountFailedAction
} from '../actions/account.actions'

import { CacheService } from '../../services/cache.service'
import { deletePassword } from '../../../lib/keychain'

@Injectable()
export class AccountEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly monzoService: MonzoService,
    private readonly cacheService: CacheService,
    private readonly router: Router
  ) {}

  @Effect()
  get$: Observable<Action> = this.actions$.pipe(
    ofType(GET_ACCOUNT),
    switchMapTo(
      this.monzoService.request<MonzoAccountsResponse>(accountsRequest())
    ),
    map(accounts => {
      const acc = accounts.accounts[0]

      return new SetAccountAction(acc)
    }),
    catchError(err => of(new GetAccountFailedAction()))
  )

  @Effect({ dispatch: false })
  logout$: Observable<any> = this.actions$.pipe(
    ofType('LOGOUT'),
    switchMapTo(this.cacheService.deleteAll()),
    switchMap(() => {
      const tokenDeletions = Promise.all([
        deletePassword({
          account: 'Monux',
          service: 'monux.monzo.access_token'
        }),
        deletePassword({
          account: 'Monux',
          service: 'monux.monzo.refresh_token'
        })
      ])

      return from(tokenDeletions).pipe(mapTo({ type: 'LOGOUT_SUCCESS' }))
    }),
    catchError(err => {
      console.error(err)
      return of({ type: 'LOGOUT_FAILED' })
    }),
    tap(_ => {
      this.router.navigate(['login'])
    })
  )

  @Effect()
  init$: Observable<Action> = this.actions$.pipe(
    ofType('@monux/init'),
    switchMapTo(defer(() => of(new GetAccountAction())))
  )
}
