import { Injectable } from '@angular/core'
import { Store, Action } from '@ngrx/store'
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects'
import { defer, Observable, of } from 'rxjs'
import { catchError, map, switchMapTo } from 'rxjs/operators'

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

@Injectable()
export class AccountEffects {
  constructor(
    private readonly store$: Store<AppState>,
    private readonly actions$: Actions,
    private readonly monzoService: MonzoService
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

  @Effect() init$: Observable<Action> = defer(() => of(new GetAccountAction()))
}
