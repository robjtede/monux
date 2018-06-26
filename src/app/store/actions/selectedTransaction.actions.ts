import { Action } from '@ngrx/store'

const actionPrefix = '[Transaction]'

export const SELECT_TRANSACTION = `${actionPrefix} Select`
export const DESELECT_TRANSACTION = `${actionPrefix} Deselect`

export class SelectTransactionAction implements Action {
  readonly type = SELECT_TRANSACTION

  constructor(public payload: string) {}
}

export class DeselectTransactionAction implements Action {
  readonly type = DESELECT_TRANSACTION
}

export type Actions = SelectTransactionAction | DeselectTransactionAction
