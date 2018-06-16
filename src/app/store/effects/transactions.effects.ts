import { Injectable } from '@angular/core'
import { Store, Action } from '@ngrx/store'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { defer, Observable, of } from 'rxjs'
import {
  catchError,
  map,
  switchMap,
  tap,
  zip,
  withLatestFrom,
  pluck
} from 'rxjs/operators'

import { startOfMonth, subMonths } from 'date-fns'

import { MonzoService } from '../../services/monzo.service'
import {
  accountsRequest,
  Account,
  MonzoAccountsResponse
} from '../../../lib/monzo/Account'
import {
  MonzoTransactionsResponse,
  Transaction,
  MonzoTransactionResponse,
  MonzoOuterTransactionResponse
} from '../../../lib/monzo/Transaction'

import { AppState } from '../'
import {
  GET_TRANSACTIONS,
  GetTransactionsAction,
  GetTransactionsFailedAction,
  PATCH_TRANSACTION_NOTES,
  PatchTransactionNotesAction,
  PatchTransactionNotesFailedAction,
  SetTransactionAction,
  SetTransactionsAction
} from '../actions/transactions.actions'
import {
  SELECT_TRANSACTION,
  SelectTransactionAction
} from '../actions/selectedTransaction.actions'

@Injectable()
export class TransactionsEffects {
  constructor(
    private readonly store$: Store<AppState>,
    private readonly actions$: Actions,
    private readonly monzo: MonzoService
  ) {}

  @Effect()
  get$: Observable<Action> = this.actions$.pipe(
    ofType(GET_TRANSACTIONS),
    zip(this.monzo.request<MonzoAccountsResponse>(accountsRequest())),
    switchMap(
      ([action, accounts]: [GetTransactionsAction, MonzoAccountsResponse]) => {
        const account = new Account(accounts.accounts[0])

        return this.monzo.request<MonzoTransactionsResponse>(
          account.transactionsRequest(action.payload)
        )
      }
    ),
    map(txs => new SetTransactionsAction(txs.transactions)),
    catchError(err => of(new GetTransactionsFailedAction()))
  )

  @Effect()
  updateNote$: Observable<Action> = this.actions$.pipe(
    ofType(PATCH_TRANSACTION_NOTES),
    switchMap(({ tx, notes }: PatchTransactionNotesAction) =>
      this.monzo.request<MonzoOuterTransactionResponse>(
        new Transaction(tx).setNotesRequest(notes)
      )
    ),
    switchMap(({ transaction: tx }) =>
      this.monzo.request<MonzoOuterTransactionResponse>(
        new Transaction(tx).selfRequest()
      )
    ),
    map(({ transaction: tx }) => new SetTransactionAction(tx)),
    catchError(err => of(new PatchTransactionNotesFailedAction()))
  )

  @Effect({ dispatch: false })
  selectTx$ = this.actions$.pipe(
    ofType(SELECT_TRANSACTION),
    withLatestFrom(this.store$),
    tap(([action, store]: [SelectTransactionAction, AppState]) => {
      const selTxId = action.payload
      if (!selTxId) return

      const tx = store.transactions.find(tx => tx.id === selTxId)
      console.log(tx ? tx : 'no tx found')
    })
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
