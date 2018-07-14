import { Action } from '@ngrx/store'
import { MonzoPotResponse } from 'monzolib'
import { suffixes } from '.'

const actionMultiplePrefix = '[Pots]'

export const GET_POTS = `${actionMultiplePrefix} Get`
export const GET_POTS_FAILED = `${actionMultiplePrefix} Get ${suffixes.failed}`

export const SET_POTS = `${actionMultiplePrefix} Set`

export class GetPotsAction implements Action {
  readonly type = GET_POTS
}
export class GetPotsFailedAction implements Action {
  readonly type = GET_POTS_FAILED
}

export class SetPotsAction implements Action {
  readonly type = SET_POTS

  constructor(public payload: MonzoPotResponse[]) {}
}

export type Actions = GetPotsAction | SetPotsAction
