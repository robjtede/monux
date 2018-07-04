import { Injectable } from '@angular/core'
import { Action, Store } from '@ngrx/store'
import { Actions, Effect, ofType } from '@ngrx/effects'
import {
  combineLatest,
  concat,
  defer,
  Observable,
  of,
  empty,
  forkJoin
} from 'rxjs'
import {
  catchError,
  filter,
  map,
  switchMap,
  switchMapTo,
  tap,
  first
} from 'rxjs/operators'
import Debug = require('debug')

import { CacheService } from '../../services/cache.service'
import { MonzoService } from '../../services/monzo.service'
import { Account } from '../../../lib/monzo/Account'
import { MonzoBalanceResponse } from '../../../lib/monzo/Amount'

import { AppState, DefiniteAccountState } from '..'
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
      forkJoin<DefiniteAccountState>(
        this.store$.select('account').pipe(
          filter(acc => !!acc),
          first()
        )
      )
    ),
    switchMap(([acc]) =>
      // stream of cached balance then http balance
      concat(
        this.cache.loadBalance(acc.id).pipe(
          map(({ balance }) => balance),
          tap(balance => {
            debug('cached balance:', balance)
          }),
          catchError(err => {
            console.error(err)
            return empty()
          })
        ),
        this.monzo
          .request<MonzoBalanceResponse>(new Account(acc).balanceRequest())
          .pipe(
            tap(balance => {
              debug('http balance:', balance)
            })
          )
      )
    ),
    map(data => new SetBalanceAction(data)),
    catchError(err => {
      console.error(err)
      return of(new GetBalanceFailedAction())
    })
  )

  @Effect({ dispatch: false })
  saveBalance$: Observable<any> = this.actions$.pipe(
    ofType(SET_BALANCE),
    switchMap((action: SetBalanceAction) =>
      combineLatest(
        this.store$.select('account').pipe(filter(acc => !!acc)),
        of(action.payload)
      )
    ),
    switchMap(([account, balanceRes]) => {
      if (account) {
        return this.cache.saveBalance(account.id, balanceRes)
      } else {
        throw new Error('cannot save balance of account that doesnt exist')
      }
    })
  )

  @Effect()
  init$: Observable<Action> = this.actions$.pipe(
    ofType('@monux/init'),
    switchMapTo(defer(() => of(new GetBalanceAction())))
  )
}
