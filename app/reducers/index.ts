import { combineReducers } from 'redux'

import { IState } from '../store'
import account from './account'
import balance from './balance'
import spent from './spent'
import pane from './pane'

export default combineReducers<IState>({
  balance,
  spent,
  account,
  activePane: pane
})
