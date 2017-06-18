import { remote } from 'electron'
import { deleteSavedCode } from '../../lib/monzo/auth'

document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.querySelector('.logout') as HTMLDivElement

  logoutButton.addEventListener('click', async _ => {
    await deleteSavedCode('access_token')
    await deleteSavedCode('refresh_token')

    localStorage.removeItem('accDescription')
    localStorage.removeItem('transactions')
    localStorage.removeItem('balance')
    localStorage.removeItem('spentToday')

    remote.getCurrentWindow().close()
  })
})
