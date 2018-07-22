import { Action } from '@ngrx/store'

const actionPrefix = '[Online]'

export const SET_ONLINE = `${actionPrefix} Set Online`
export const SET_OFFLINE = `${actionPrefix} Set Offline`

export class SetOnlineAction implements Action {
  readonly type = SET_ONLINE
}

export class SetOfflineAction implements Action {
  readonly type = SET_OFFLINE
}

export type Actions = SetOnlineAction | SetOfflineAction
