import { Injectable } from '@angular/core'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { Action, Store } from '@ngrx/store'
import { startOfMonth, subMonths } from 'date-fns'
import { defer, Observable, of } from 'rxjs'
import {
  catchError,
  map,
  switchMap,
  tap,
  withLatestFrom,
  zip
} from 'rxjs/operators'

import { AppState } from '../'
import {
  Account,
  accountsRequest,
  MonzoAccountsResponse
} from '../../../lib/monzo/Account'
import {
  MonzoOuterTransactionResponse,
  MonzoTransactionsResponse,
  Transaction
} from '../../../lib/monzo/Transaction'
import { MonzoService } from '../../services/monzo.service'
import {
  SELECT_TRANSACTION,
  SelectTransactionAction
} from '../actions/selectedTransaction.actions'
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
  patchNote$: Observable<Action> = this.actions$.pipe(
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
