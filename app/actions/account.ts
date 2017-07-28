import { createAction } from 'redux-actions'

import { EActions } from './index'
import { IMonzoApiAccount } from '../../lib/monzo'

export interface ISetAccountPayload {
  bank: string
  acc: IMonzoApiAccount
}

export const setAccount = createAction<
  ISetAccountPayload,
  string,
  IMonzoApiAccount
>(EActions.SET_ACCOUNT, (bank, acc) => ({
  bank,
  acc
}))
