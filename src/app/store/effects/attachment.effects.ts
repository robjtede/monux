import { Injectable } from '@angular/core'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { Action, Store } from '@ngrx/store'
import { forkJoin, Observable, of } from 'rxjs'
import { catchError, switchMap, withLatestFrom } from 'rxjs/operators'
import Debug = require('debug')

import { MonzoService } from '../../services/monzo.service'

import { AppState } from '../'
import {
  DEREGISTER_ATTACHMENT,
  DeregisterAttachmentAction,
  DeregisterAttachmentFailedAction
} from '../actions/attachment.actions'
import {
  MonzoTransactionOuterResponse,
  MonzoTransactionResponse,
  Transaction
} from '../../../lib/monzo/Transaction'
import { SetTransactionAction } from '../actions/transactions.actions'

const debug = Debug('app:effects:attachment')

@Injectable()
export class AttachmentEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store$: Store<AppState>,
    private readonly monzo: MonzoService
  ) {}

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
