import { Injectable } from '@angular/core'
import { createAction } from 'redux-actions'

@Injectable()
export class PaneActions {
  static readonly SET_PANE = 'SET_PANE'

  setPane(pane: string) {
    return createAction<SetPanePayload, string>(PaneActions.SET_PANE, pane => ({
      pane
    }))(pane)
  }
}

export interface SetPanePayload {
  pane: string
}
