import { Injectable } from '@angular/core'
import { createAction } from 'redux-actions'

import { AmountOpts } from '../../lib/monzo/Amount'

@Injectable()
export class SpentActions {
  static readonly SET_SPENT = 'SET_SPENT'

  setSpent(spent: AmountOpts) {
    return createAction<
      SetSpentPayload,
      AmountOpts
    >(SpentActions.SET_SPENT, spent => ({
      amount: spent
    }))(spent)
  }
}

export interface SetSpentPayload {
  amount: AmountOpts
}
