import { Injectable } from '@angular/core'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { Action, Store } from '@ngrx/store'
import { startOfMonth, subMonths } from 'date-fns'
import Debug = require('debug')
import {
  Account,
  MonzoTransactionOuterResponse,
  MonzoTransactionsResponse,
  Transaction,
  MonzoTransactionResponse
} from 'monzolib'
import { combineLatest, concat, empty, Observable, of } from 'rxjs'
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
  SetTransactionsAction,
  HIDE_TRANSACTION,
  HideTransactionAction,
  HideTransactionFailedAction,
  ChangeCategoryFailedAction,
  SET_TRANSACTION,
  AppendTransactionsAction
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
  get$: Observable<Action> = this.actions$.pipe(
    ofType<GetTransactionsAction>(GET_TRANSACTIONS),
    switchMap(action =>
      combineLatest<GetTransactionsAction, DefiniteAccountState>(
        of(action),
        this.store$.select('account').pipe(
          filter(acc => !!acc),
          first()
        )
      )
    ),
    switchMap(([action, acc]) =>
      combineLatest(
        of(action),
        // stream of cached pots then http pots
        concat(
          this.cache.loadTransactions(acc.id, action.opts).pipe(
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
              new Account(acc).transactionsRequest(action.opts)
            )
            .pipe(
              map(({ transactions }) => transactions),
              tap(txs => {
                debug(txs.length, 'http txs:', txs)
              })
            )
        )
      )
    ),
    map(
      ([action, txs]) =>
        action.append
          ? new AppendTransactionsAction(txs)
          : new SetTransactionsAction(txs)
    ),
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
      return of(new ChangeCategoryFailedAction())
    })
  )

  @Effect()
  patchHide$: Observable<Action> = this.actions$.pipe(
    ofType(HIDE_TRANSACTION),
    switchMap(({ tx }: HideTransactionAction) =>
      this.monzo.request<MonzoTransactionOuterResponse>(tx.hideRequest())
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
      return of(new HideTransactionFailedAction())
    })
  )

  @Effect({ dispatch: false })
  save$: Observable<any> = this.actions$.pipe(
    ofType(SET_TRANSACTIONS),
    switchMap((action: SetTransactionsAction) =>
      combineLatest(this.store$.select('account'), of(action.payload))
    ),
    switchMap(([account, txs]) => {
      if (account) {
        return this.cache.saveTransactions(account.id, txs)
      } else {
        throw new Error('cannot save transactions of account that doesnt exist')
      }
    })
  )

  @Effect({ dispatch: false })
  saveSingle$: Observable<any> = this.actions$.pipe(
    ofType(SET_TRANSACTION),
    switchMap((action: SetTransactionAction) =>
      combineLatest(this.store$.select('account'), of(action.tx))
    ),
    switchMap(([account, tx]) => {
      if (account) {
        return this.cache.saveTransactions(account.id, [tx])
      } else {
        throw new Error('cannot save transaction of account that doesnt exist')
      }
    })
  )

  @Effect({ dispatch: false })
  logSelected$: Observable<any> = this.actions$.pipe(
    ofType(SELECT_TRANSACTION),
    withLatestFrom(this.store$),
    tap(([action, store]: [SelectTransactionAction, AppState]) => {
      const selTxId = action.payload
      if (!selTxId) return

      const tx = new Transaction(store.transactions.find(
        tx => tx.id === selTxId
      ) as MonzoTransactionResponse)
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
