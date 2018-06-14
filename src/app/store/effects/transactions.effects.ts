import { Injectable } from '@angular/core'
import { Store, Action } from '@ngrx/store'
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects'
import { defer, Observable, of } from 'rxjs'
import { catchError, map, switchMap, switchMapTo } from 'rxjs/operators'

import { MonzoService } from '../../services/monzo.service'
import {
  accountsRequest,
  Account,
  MonzoAccountsResponse
} from '../../../lib/monzo/Account'
import { MonzoTransactionsResponse } from '../../../lib/monzo/Transaction'

import { AppState } from '../'
import {
  GET_TRANSACTIONS,
  SetTransactionsAction,
  GetTransactionsAction,
  GetTransactionsFailedAction
} from '../actions/transactions.actions'

@Injectable()
export class TransactionsEffects {
  constructor(
    private readonly store$: Store<AppState>,
    private readonly actions$: Actions,
    private readonly monzoService: MonzoService
  ) {}

  @Effect()
  get$: Observable<Action> = this.actions$.pipe(
    ofType(GET_TRANSACTIONS),
    switchMapTo(
      this.monzoService.request<MonzoAccountsResponse>(accountsRequest())
    ),
    switchMap(accounts => {
      const account = new Account(accounts.accounts[0])

      return this.monzoService.request<MonzoTransactionsResponse>(
        account.transactionsRequest()
      )
    }),
    map(txs => new SetTransactionsAction(txs.transactions)),
    catchError(err => of(new GetTransactionsFailedAction()))
  )

  @Effect()
  init$: Observable<Action> = defer(() => of(new GetTransactionsAction()))
}
