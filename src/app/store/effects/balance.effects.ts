import { extractBalanceAndSpent } from '../../../lib/monzo/helpers'
import { Injectable } from '@angular/core'
import { Action, Store } from '@ngrx/store'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { defer, Observable, of, combineLatest } from 'rxjs'
import { catchError, map, switchMap, switchMapTo, tap } from 'rxjs/operators'
import Debug = require('debug')

import { CacheService } from '../../services/cache.service'
import { MonzoService } from '../../services/monzo.service'
import {
  accountsRequest,
  Account,
  MonzoAccountsResponse
} from '../../../lib/monzo/Account'
import { MonzoBalanceResponse } from '../../../lib/monzo/Amount'

import { AppState } from '..'
import {
  GET_BALANCE,
  SetBalanceAction,
  GetBalanceAction,
  GetBalanceFailedAction,
  SET_BALANCE
} from '../actions/balance.actions'

const debug = Debug('app:effects:balance')

@Injectable()
export class BalanceEffects {
  constructor(
    private store$: Store<AppState>,
    private actions$: Actions,
    private monzo: MonzoService,
    private cache: CacheService
  ) {}

  @Effect()
  get$: Observable<Action> = this.actions$.pipe(
    ofType(GET_BALANCE),
    switchMap(() =>
      this.monzo.request<MonzoAccountsResponse>(accountsRequest())
    ),
    switchMap(accounts => {
      const account = new Account(accounts.accounts[0])

      return this.monzo.request<MonzoBalanceResponse>(account.balanceRequest())
    }),
    map(data => new SetBalanceAction(data)),
    catchError(err => {
      console.error(err)
      return of(new GetBalanceFailedAction())
    })
  )

  @Effect({ dispatch: false })
  saveAccount$: Observable<any> = this.actions$.pipe(
    ofType(SET_BALANCE),
    switchMap((action: SetBalanceAction) =>
      combineLatest(this.store$.select('account'), of(action.payload))
    ),
    switchMap(([account, balanceRes]) => {
      if (account) {
        const { balance } = extractBalanceAndSpent(balanceRes)
        return this.cache.saveAccount$(new Account(account), balance)
      } else {
        throw new Error('cannot save account that doesnt exist')
      }
    }),
    tap(debug, debug)
  )

  @Effect()
  init$: Observable<Action> = this.actions$.pipe(
    ofType('@monux/init'),
    switchMapTo(defer(() => of(new GetBalanceAction())))
  )
}
