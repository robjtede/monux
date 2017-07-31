import * as Debug from 'debug'

import { remote } from 'electron'

import { deleteSavedCode } from '../../lib/monzo/auth'
import db from '../scripts/cache'

const debug = Debug('app:scripts:logout')

document.addEventListener('DOMContentLoaded', () => {
  debug('logging out and clearing cache')
  const logoutButton = document.querySelector('.logout') as HTMLDivElement

  logoutButton.addEventListener('click', async _ => {
    localStorage.removeItem('accDescription')
    localStorage.removeItem('transactions')
    localStorage.removeItem('balance')
    localStorage.removeItem('spentToday')

    await Promise.all([
      db.transactions.clear(),
      db.accounts.clear(),
      deleteSavedCode('access_token'),
      deleteSavedCode('refresh_token')
    ])

    debug('exiting monux')
    remote.app.quit()
  })
})
