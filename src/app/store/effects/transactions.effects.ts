import { Injectable } from '@angular/core'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { Action, Store } from '@ngrx/store'
import { startOfMonth, subMonths } from 'date-fns'
import Debug = require('debug')
import {
  Account,
  MonzoTransactionOuterResponse,
  MonzoTransactionsResponse,
  Transaction
} from 'monzolib'
import { combineLatest, concat, empty, forkJoin, Observable, of } from 'rxjs'
import {
  catchError,
  filter,
  first,
  map,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators'

import { AppState, DefiniteAccountState } from '../'
import { CacheService } from '../../services/cache.service'
import { MonzoService } from '../../services/monzo.service'
import {
  SELECT_TRANSACTION,
  SelectTransactionAction
} from '../actions/selectedTransaction.actions'
import {
  ChangeCategoryAction,
  GET_TRANSACTIONS,
  GetTransactionsAction,
  GetTransactionsFailedAction,
  PATCH_CATEGORY,
  PATCH_TRANSACTION_NOTES,
  PatchTransactionNotesAction,
  PatchTransactionNotesFailedAction,
  SET_TRANSACTIONS,
  SetTransactionAction,
  SetTransactionsAction
} from '../actions/transactions.actions'

const debug = Debug('app:effects:transactions')

@Injectable()
export class TransactionsEffects {
  constructor(
    private store$: Store<AppState>,
    private actions$: Actions,
    private monzo: MonzoService,
    private cache: CacheService
  ) {}

  @Effect()
  getTransactions$: Observable<Action> = this.actions$.pipe(
    ofType<GetTransactionsAction>(GET_TRANSACTIONS),
    switchMap(action =>
      forkJoin<GetTransactionsAction, DefiniteAccountState>(
        of(action),
        this.store$.select('account').pipe(
          filter(acc => !!acc),
          first()
        )
      )
    ),
    switchMap(([action, acc]) => {
      return concat(
        this.cache.loadTransactions(acc.id, action.payload).pipe(
          tap(txs => {
            debug(txs.length, 'cache txs:', txs)
          }),
          catchError(err => {
            console.error(err)
            return empty()
          })
        ),
        this.monzo
          .request<MonzoTransactionsResponse>(
            new Account(acc).transactionsRequest(action.payload)
          )
          .pipe(
            map(({ transactions }) => transactions),
            tap(txs => {
              debug(txs.length, 'http txs:', txs)
            })
          )
      )
    }),
    map(txs => new SetTransactionsAction(txs)),
    catchError(err => {
      console.error(err)
      return of(new GetTransactionsFailedAction())
    })
  )

  @Effect()
  patchNote$: Observable<Action> = this.actions$.pipe(
    ofType(PATCH_TRANSACTION_NOTES),
    switchMap(({ tx, notes }: PatchTransactionNotesAction) =>
      this.monzo.request<MonzoTransactionOuterResponse>(
        tx.setNotesRequest(notes)
      )
    ),
    switchMap(({ transaction: tx }) =>
      // TODO: remove extraneous api call
      this.monzo.request<MonzoTransactionOuterResponse>(
        new Transaction(tx).selfRequest()
      )
    ),
    map(({ transaction: tx }) => new SetTransactionAction(tx)),
    catchError(err => {
      console.error(err)
      return of(new PatchTransactionNotesFailedAction())
    })
  )

  @Effect()
  patchCategory$: Observable<Action> = this.actions$.pipe(
    ofType(PATCH_CATEGORY),
    switchMap(({ tx, category }: ChangeCategoryAction) =>
      this.monzo.request<MonzoTransactionOuterResponse>(
        tx.changeCategoryRequest(category)
      )
    ),
    switchMap(({ transaction: tx }) =>
      // TODO: remove extraneous api call
      this.monzo.request<MonzoTransactionOuterResponse>(
        new Transaction(tx).selfRequest()
      )
    ),
    map(({ transaction: tx }) => new SetTransactionAction(tx)),
    catchError(err => {
      console.error(err)
      return of(new PatchTransactionNotesFailedAction())
    })
  )

  @Effect({ dispatch: false })
  saveTransactions$: Observable<any> = this.actions$.pipe(
    ofType(SET_TRANSACTIONS),
    switchMap((action: SetTransactionsAction) =>
      combineLatest(this.store$.select('account'), of(action.payload))
    ),
    switchMap(([account, txs]) => {
      if (account) {
        return this.cache.saveTransactions(account.id, txs)
      } else {
        throw new Error('cannot save transaction of account that doesnt exist')
      }
    })
  )

  @Effect({ dispatch: false })
  logSelectTx$: Observable<any> = this.actions$.pipe(
    ofType(SELECT_TRANSACTION),
    withLatestFrom(this.store$),
    tap(([action, store]: [SelectTransactionAction, AppState]) => {
      const selTxId = action.payload
      if (!selTxId) return

      const tx = store.transactions.find(tx => tx.id === selTxId)
      debug('selected tx =>', tx || 'no tx found')
    })
  )

  @Effect()
  init$: Observable<Action> = this.actions$.pipe(
    ofType('@monux/init'),
    switchMap(() => {
      const startDate = subMonths(startOfMonth(Date.now()), 0)

      return of(
        new GetTransactionsAction({
          since: startDate
        })
      )
    })
  )
}
