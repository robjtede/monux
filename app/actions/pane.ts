import { createAction } from 'redux-actions'

import { EActions } from './index'

export interface ISetPanePayload {
  pane: string
}

export const setPane = createAction<
  ISetPanePayload,
  string
>(EActions.SET_PANE, pane => ({
  pane
}))
