import { resolve, join } from 'path'

import * as Debug from 'debug'

import { remote } from 'electron'

import { Amount } from '../../lib/monzo'

const { TouchBar } = remote.require('electron')
const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar

const debug = Debug('app:renderer:touchbar')

const setTouchBar = async (balance: Amount, spentToday: Amount) => {
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

  debug('balance =>', balance)
  debug('spent today =>', spentToday)

  tbBalance.label = `Balance: ${balance.format('%y%a')}`
  tbSpent.label = `Spent Today: ${spentToday.format('%y%a')}`
}

export default setTouchBar
