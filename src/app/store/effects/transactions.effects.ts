import { Injectable } from '@angular/core'
import { Store, Action } from '@ngrx/store'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { defer, Observable, of } from 'rxjs'
import { catchError, map, switchMap, zip } from 'rxjs/operators'

import { startOfMonth, subMonths } from 'date-fns'

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
    zip(this.monzoService.request<MonzoAccountsResponse>(accountsRequest())),
    switchMap(
      ([action, accounts]: [GetTransactionsAction, MonzoAccountsResponse]) => {
        const account = new Account(accounts.accounts[0])

        return this.monzoService.request<MonzoTransactionsResponse>(
          account.transactionsRequest(action.payload)
        )
      }
    ),
    map(txs => new SetTransactionsAction(txs.transactions)),
    catchError(err => of(new GetTransactionsFailedAction()))
  )

  @Effect()
  init$: Observable<Action> = defer(() => {
    const startDate = subMonths(startOfMonth(Date.now()), 1)

    return of(
      new GetTransactionsAction({
        since: startDate
      })
    )
  })
}
