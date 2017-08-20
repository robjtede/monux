import { combineReducers } from 'redux'

import { AppState } from '../store'

import { reducer as account } from './account'
import { reducer as balance } from './balance'
import { reducer as spent } from './spent'
import { reducer as activePane } from './activePane'
import { reducer as transactions } from './transactions'
import { reducer as selectedTransaction } from './selectedTransaction'

export const rootReducer = combineReducers<AppState>({
  balance,
  spent,
  account,
  activePane,
  transactions,
  selectedTransaction
})
