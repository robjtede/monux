import { remote } from 'electron'

import { deleteSavedCode } from '../../lib/monzo/auth'
import db from '../scripts/cache'

document.addEventListener('DOMContentLoaded', () => {
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

    remote.app.quit()
  })
})
