import { remote } from 'electron'
import { saveCode } from '../lib/monzo/auth'

const { app } = remote.require('electron')

document.addEventListener('DOMContentLoaded', () => {
  const $submit = document.querySelector('button') as HTMLButtonElement
  const $id = document.querySelector('#client_id') as HTMLInputElement
  const $secret = document.querySelector('#client_secret') as HTMLInputElement

  $submit.addEventListener('click', async () => {
    await saveCode('client_id', $id.value)
    await saveCode('client_secret', $secret.value)

    app.relaunch()
    app.quit()
  })
})
