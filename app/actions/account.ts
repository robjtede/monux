import { ActionCreator } from 'redux'

import { IAction, EActions } from './index'

export interface ISetAccountAction extends IAction {
  type: EActions.SET_ACCOUNT
  name: string
  bank: string
}

export const setAccount: ActionCreator<ISetAccountAction> = (
  name: string,
  bank: string
) => {
  return {
    type: EActions.SET_ACCOUNT,
    name,
    bank
  }
}
