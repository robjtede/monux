import { Action } from '@ngrx/store'

export const SELECT_TRANSACTION = '[Transaction] Select'
export const DESELECT_TRANSACTION = '[Transaction] Deselect'

export class SelectTransactionAction implements Action {
  readonly type = SELECT_TRANSACTION

  constructor(public payload: string) {}
}

export class DeselectTransactionAction implements Action {
  readonly type = DESELECT_TRANSACTION
}

export type Actions = SelectTransactionAction | DeselectTransactionAction
