const { saveCode } = require('../lib/monzo/auth')

document.querySelector('button').addEventListener('click', async () => {
  await saveCode('client_id', document.querySelector('#client_id').value)
  await saveCode(
    'client_secret',
    document.querySelector('#client_secret').value
  )

  document.querySelector('.message').textContent =
    'Close this window to continue.'
})
