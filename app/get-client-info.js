const { setPassword } = require('../src/keychain')

document.querySelector('button').addEventListener('click', async () => {
  await setPassword({
    account: 'Monux',
    service: 'client_id',
    password: document.querySelector('#client_id').value
  })

  await setPassword({
    account: 'Monux',
    service: 'client_secret',
    password: document.querySelector('#client_secret').value
  })

  document.querySelector('.message').textContent =
    'Close this window to continue.'
})
