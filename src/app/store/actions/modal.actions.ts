import { Action } from '@ngrx/store'

const actionPrefix = '[Modal]'

export const OPEN_MODAL = `${actionPrefix} Open`
export const CLOSE_MODAL = `${actionPrefix} Close`

export class OpenModalAction implements Action {
  readonly type = OPEN_MODAL
}

export class CloseModalAction implements Action {
  readonly type = CLOSE_MODAL
}

export type Actions = OpenModalAction | CloseModalAction
