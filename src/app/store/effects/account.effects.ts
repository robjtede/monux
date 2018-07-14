import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { Action } from '@ngrx/store'
import Debug = require('debug')
import {
  accountsRequest,
  MonzoAccountResponse,
  MonzoAccountsResponse
} from 'monzolib'
import { concat, defer, from, Observable, of } from 'rxjs'
import {
  catchError,
  filter,
  map,
  mapTo,
  switchMap,
  switchMapTo,
  tap
} from 'rxjs/operators'

import { deletePassword } from '../../../lib/keychain'
import { CacheService } from '../../services/cache.service'
import { MonzoService } from '../../services/monzo.service'
import {
  GET_ACCOUNT,
  GetAccountAction,
  GetAccountFailedAction,
  LOGOUT,
  LOGOUT_FAILED,
  SET_ACCOUNT,
  SetAccountAction
} from '../actions/account.actions'

const debug = Debug('app:effects:account')

@Injectable()
export class AccountEffects {
  constructor(
    private actions$: Actions,
    private monzo: MonzoService,
    private cache: CacheService,
    private router: Router
  ) {}

  @Effect()
  get$: Observable<Action> = this.actions$.pipe(
    ofType(GET_ACCOUNT),
    switchMap(() =>
      concat(
        this.cache.loadAccounts().pipe(
          map(([account]) => (account ? account.acc : undefined)),
          tap(account => debug('cached account', account))
        ),
        this.monzo.request<MonzoAccountsResponse>(accountsRequest()).pipe(
          map(accounts => accounts.accounts[0]),
          tap(account => debug('http account', account))
        )
      )
    ),
    filter(account => !!account),
    map((account: MonzoAccountResponse) => new SetAccountAction(account)),
    catchError(err => {
      console.error(err)
      return of(new GetAccountFailedAction())
    })
  )

  @Effect({ dispatch: false })
  saveAccount$: Observable<any> = this.actions$.pipe(
    ofType(SET_ACCOUNT),
    switchMap((acc: SetAccountAction) => this.cache.saveAccount(acc.payload))
  )

  @Effect({ dispatch: false })
  logout$: Observable<any> = this.actions$.pipe(
    ofType(LOGOUT),
    switchMapTo(defer(() => this.cache.deleteAll())),
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
      return of({ type: LOGOUT_FAILED })
    }),
    tap(() => {
      this.router.navigate(['/auth-request'])
    })
  )

  @Effect()
  init$: Observable<Action> = this.actions$.pipe(
    ofType('@monux/init'),
    switchMapTo(defer(() => of(new GetAccountAction())))
  )
}
