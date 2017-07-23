import { ActionCreator } from 'redux'

import { IAction, EActions } from './index'

export interface ISetPaneAction extends IAction {
  type: EActions.SET_PANE
  pane: string
}

export const setPane: ActionCreator<ISetPaneAction> = (pane: string) => {
  return {
    type: EActions.SET_PANE,
    pane
  }
}
