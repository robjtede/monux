import { resolve, join } from 'path'

import * as Debug from 'debug'
import { remote } from 'electron'

import { Amount } from '../../lib/monzo'
import store from '../store'

const { TouchBar } = remote.require('electron')
const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar

const debug = Debug('app:scripts:touchbar')

const tbBalance = new TouchBarLabel({
  label: 'Balance: $--.--'
})
const tbSpent = new TouchBarLabel({
  label: 'Spent Today: $--.--'
})

const escKey = new TouchBarButton({
  icon: resolve(join(resolve('.'), 'app', 'icons', 'monzo.touchbar.png')),
  label: 'Monux',
  iconPosition: 'left',
  backgroundColor: '#15233C'
})

const touchBar = new TouchBar({
  items: [tbBalance, new TouchBarSpacer({ size: 'large' }), tbSpent],
  escapeItem: escKey
})
remote.getCurrentWindow().setTouchBar(touchBar)

store.subscribe(() => {
  const state = store.getState()

  const balance = new Amount(state.balance.native, state.balance.local)
  const spent = new Amount(state.spent.native, state.spent.local)

  debug('balance =>', balance)
  debug('spent today =>', spent)

  if (balance) tbBalance.label = `Balance: ${balance.format('%y%m')}`
  if (spent) tbSpent.label = `Spent Today: ${spent.format('%y%m')}`
})
