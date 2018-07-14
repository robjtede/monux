import { Injectable } from '@angular/core'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { Action, Store } from '@ngrx/store'
import Debug = require('debug')
import { MonzoPotsResponse, potsRequest } from 'monzolib'
import { concat, defer, Observable, of } from 'rxjs'
import { catchError, map, switchMap, switchMapTo, tap } from 'rxjs/operators'

import { AppState } from '..'
import { CacheService } from '../../services/cache.service'
import { MonzoService } from '../../services/monzo.service'
import {
  GET_POTS,
  SetPotsAction,
  GetPotsFailedAction,
  GetPotsAction
} from '../actions/pots.actions'

const debug = Debug('app:effects:pots')

@Injectable()
export class PotsEffects {
  constructor(
    private store$: Store<AppState>,
    private actions$: Actions,
    private monzo: MonzoService,
    private cache: CacheService
  ) {}

  @Effect()
  get$: Observable<Action> = this.actions$.pipe(
    ofType(GET_POTS),
    switchMap(() =>
      // stream of cached pots then http pots
      concat(
        // this.cache.loadpots(acc.id).pipe(
        //   map(({ pots }) => pots),
        //   tap(pots => {
        //     debug('cached pots:', pots)
        //   }),
        //   catchError(err => {
        //     console.error(err)
        //     return empty()
        //   })
        // ),
        this.monzo.request<MonzoPotsResponse>(potsRequest()).pipe(
          tap(pots => {
            debug('http pots', pots)
          })
        )
      )
    ),
    map(({ pots }) => new SetPotsAction(pots)),
    catchError(err => {
      console.error(err)
      return of(new GetPotsFailedAction())
    })
  )

  // @Effect({ dispatch: false })
  // savepots$: Observable<any> = this.actions$.pipe(
  //   ofType(SET_pots),
  //   switchMap((action: SetpotsAction) =>
  //     combineLatest(
  //       this.store$.select('account').pipe(filter(acc => !!acc)),
  //       of(action.payload)
  //     )
  //   ),
  //   switchMap(([account, potsRes]) => {
  //     if (account) {
  //       return this.cache.savepots(account.id, potsRes)
  //     } else {
  //       throw new Error('cannot save pots of account that doesnt exist')
  //     }
  //   })
  // )

  @Effect()
  init$: Observable<Action> = this.actions$.pipe(
    ofType('@monux/init'),
    switchMapTo(defer(() => of(new GetPotsAction())))
  )
}
