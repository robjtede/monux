import { createAction } from 'redux-actions'

import { EActions } from './'

export const setPane = createAction<
  SetPanePayload,
  string
>(EActions.SET_PANE, pane => ({
  pane
}))

export interface SetPanePayload {
  pane: string
}
