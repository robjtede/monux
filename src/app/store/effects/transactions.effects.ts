import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { Action, Store } from '@ngrx/store'
import { startOfMonth, subMonths } from 'date-fns'
import { defer, forkJoin, Observable, of } from 'rxjs'
import {
  catchError,
  map,
  switchMap,
  switchMapTo,
  tap,
  withLatestFrom,
  zip
} from 'rxjs/operators'
import Debug = require('debug')

import { AppState } from '../'
import {
  Account,
  accountsRequest,
  MonzoAccountsResponse
} from '../../../lib/monzo/Account'
import {
  MonzoAttachmentUploadResponse,
  MonzoAttachmentOuterResponse
} from '../../../lib/monzo/Attachment'
import {
  MonzoTransactionOuterResponse,
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
  SetTransactionsAction,
  UPLOAD_ATTACHMENT,
  UploadAttachmentAction
} from '../actions/transactions.actions'

const debug = Debug('app:effects:transactions')

@Injectable()
export class TransactionsEffects {
  constructor(
    private readonly store$: Store<AppState>,
    private readonly actions$: Actions,
    private readonly monzo: MonzoService,
    private http: HttpClient
  ) {}

  @Effect()
  getTransactions$: Observable<Action> = this.actions$.pipe(
    ofType(GET_TRANSACTIONS),
    switchMap(action => {
      return forkJoin(
        of(action),
        this.monzo.request<MonzoAccountsResponse>(accountsRequest())
      )
    }),
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
    catchError(err => of(new PatchTransactionNotesFailedAction()))
  )

  @Effect()
  uploadAttachment$: Observable<Action> = this.actions$.pipe(
    ofType(UPLOAD_ATTACHMENT),
    switchMap(({ tx, file }: UploadAttachmentAction) => {
      debug('uploading attachment', file)

      const contentType = 'image/jpeg'

      return forkJoin(
        of(tx),
        of(file),
        of(contentType),
        this.monzo.request<MonzoAttachmentUploadResponse>(
          tx.attachmentUploadRequest(contentType)
        )
      )
    }),
    switchMap(([tx, file, type, { upload_url, file_url }]) => {
      debug('got attachment upload url', upload_url, file_url)

      const headers = new HttpHeaders()
      headers.set('Content-Type', type)

      return forkJoin(
        of(tx),
        of(file_url),
        of(type),
        this.http.put(upload_url, file, {
          headers
        })
      )
    }),
    switchMap(([tx, file_url, type, res]) => {
      debug('done uploading', res)

      return forkJoin(
        of(tx),
        this.monzo.request<MonzoAttachmentOuterResponse>(
          tx.attachmentRegisterRequest(file_url, type)
        )
      )
    }),
    tap(([_, { file_url }]) => {
      debug('registered attachment', file_url)
    }),
    switchMap(([tx]) =>
      // TODO: remove extraneous api call
      this.monzo.request<MonzoTransactionOuterResponse>(tx.selfRequest())
    ),
    map(({ transaction: tx }) => new SetTransactionAction(tx))
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
      // const startDate = subMonths(startOfMonth(Date.now()), 1)
      const startDate = startOfMonth(Date.now())

      return of(
        new GetTransactionsAction({
          since: startDate
        })
      )
    })
  )
}
