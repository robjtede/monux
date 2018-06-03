import { Action } from '@ngrx/store'

export const SELECT_TRANSACTION = '[TRANSACTION] Select'
export const DESELECT_TRANSACTION = '[TRANSACTION] Deselect'

export class SelectTransactionAction implements Action {
  readonly type = SELECT_TRANSACTION

  constructor(public payload: string) {}
}

export class DeselectTransactionAction implements Action {
  readonly type = DESELECT_TRANSACTION
}

export type Actions = SelectTransactionAction | DeselectTransactionAction
