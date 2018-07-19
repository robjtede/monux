import { Injectable } from '@angular/core'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { Action, Store } from '@ngrx/store'
import Debug = require('debug')
import { MonzoPotsResponse, potsRequest } from 'monzolib'
import { concat, defer, Observable, of, combineLatest, empty } from 'rxjs'
import {
  catchError,
  map,
  switchMap,
  switchMapTo,
  tap,
  filter
} from 'rxjs/operators'

import { AppState } from '..'
import { CacheService } from '../../services/cache.service'
import { MonzoService } from '../../services/monzo.service'
import {
  GET_POTS,
  SetPotsAction,
  GetPotsFailedAction,
  GetPotsAction,
  SET_POTS
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
  getAll$: Observable<Action> = this.actions$.pipe(
    ofType(GET_POTS),
    switchMap(() =>
      // stream of cached pots then http pots
      concat(
        this.cache.loadPots().pipe(
          map(pots => pots.map(({ pot }) => pot)),
          tap(pots => {
            debug(pots.length, 'cached pots:', pots)
          }),
          catchError(err => {
            console.error(err)
            return empty()
          })
        ),
        this.monzo.request<MonzoPotsResponse>(potsRequest()).pipe(
          map(({ pots }) => pots),
          tap(pots => {
            debug(pots.length, 'http pots', pots)
          })
        )
      )
    ),
    map(pots => new SetPotsAction(pots)),
    catchError(err => {
      console.error(err)
      return of(new GetPotsFailedAction())
    })
  )

  @Effect({ dispatch: false })
  save$: Observable<any> = this.actions$.pipe(
    ofType(SET_POTS),
    switchMap((action: SetPotsAction) => {
      return this.cache.savePots(action.payload)
    })
  )

  @Effect()
  init$: Observable<Action> = this.actions$.pipe(
    ofType('@monux/init'),
    switchMapTo(defer(() => of(new GetPotsAction())))
  )
}
