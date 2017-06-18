import { remote } from 'electron'
import { deleteSavedCode } from '../../lib/monzo/auth'

document.addEventListener('DOMContentLoaded', async () => {
  document.querySelector('.logout').addEventListener('click', _ => {
    await deleteSavedCode('access_token')
    await deleteSavedCode('refresh_token')

    localStorage.removeItem('accDescription')
    localStorage.removeItem('transactions')
    localStorage.removeItem('balance')
    localStorage.removeItem('spentToday')

    remote.getCurrentWindow().close()
  })
})
