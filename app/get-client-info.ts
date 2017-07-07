const { saveCode } = require('../lib/monzo/auth')

const $submit = document.querySelector('button') as HTMLButtonElement
const $id = document.querySelector('#client_id') as HTMLInputElement
const $secret = document.querySelector('#client_secret') as HTMLInputElement
const $message = document.querySelector('.message') as HTMLDivElement

$submit.addEventListener('click', async () => {
  await saveCode('client_id', $id.value)
  await saveCode('client_secret', $secret.value)

  $message.textContent = 'Close this window to continue.'
})
