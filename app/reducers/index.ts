import { combineReducers } from 'redux'

import { IState } from '../store'
import account from './account'
import balance from './balance'
import spent from './spent'
import activePane from './activePane'
import transactions from './transactions'
import selectedTransaction from './selectedTransaction'

export default combineReducers<IState>({
  balance,
  spent,
  account,
  activePane,
  transactions,
  selectedTransaction
})
