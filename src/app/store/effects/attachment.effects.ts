import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { Action, Store } from '@ngrx/store'
import { forkJoin, Observable, of } from 'rxjs'
import { catchError, switchMap, tap, withLatestFrom, map } from 'rxjs/operators'
import Debug = require('debug')

import { MonzoService } from '../../services/monzo.service'

import { AppState } from '../'
import {
  DEREGISTER_ATTACHMENT,
  DeregisterAttachmentAction,
  DeregisterAttachmentFailedAction
} from '../actions/attachment.actions'
import {
  SetTransactionAction,
  UPLOAD_ATTACHMENT,
  UploadAttachmentAction
} from '../actions/transactions.actions'
import {
  MonzoAttachmentOuterResponse,
  MonzoAttachmentUploadResponse
} from '../../../lib/monzo/Attachment'
import {
  MonzoTransactionOuterResponse,
  MonzoTransactionResponse,
  Transaction
} from '../../../lib/monzo/Transaction'

const debug = Debug('app:effects:attachment')

@Injectable()
export class AttachmentEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private monzo: MonzoService,
    private http: HttpClient
  ) {}

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

  @Effect()
  deregisterAttachment$: Observable<Action> = this.actions$.pipe(
    ofType(DEREGISTER_ATTACHMENT),
    switchMap(({ payload: attachment }: DeregisterAttachmentAction) => {
      const req = attachment.selfDeregisterRequest()
      return forkJoin(of(attachment), this.monzo.request<{}>(req))
    }),
    withLatestFrom(this.store$),
    switchMap(([[attachment, _], store]) => {
      const tx = store.transactions.find(
        tx => tx.id === attachment.txId
      ) as MonzoTransactionResponse

      return this.monzo.request<MonzoTransactionOuterResponse>(
        new Transaction(tx).selfRequest()
      )
    }),
    switchMap(({ transaction }) => of(new SetTransactionAction(transaction))),
    catchError(err => {
      console.error(err)
      return of(new DeregisterAttachmentFailedAction())
    })
  )
}
