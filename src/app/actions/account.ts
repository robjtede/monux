import { Injectable } from '@angular/core'
import { createAction } from 'redux-actions'

import { MonzoAccountResponse } from '../../lib/monzo/Account'

@Injectable()
export class AccountActions {
  static readonly SET_ACCOUNT = 'SET_ACCOUNT'

  setAccount(bank: string, acc: MonzoAccountResponse) {
    return createAction<
      SetAccountPayload,
      string,
      MonzoAccountResponse
    >(AccountActions.SET_ACCOUNT, (bank, acc) => ({
      bank,
      acc
    }))(bank, acc)
  }
}

export interface SetAccountPayload {
  bank: string
  acc: MonzoAccountResponse
}
