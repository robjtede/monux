const request = require('request-promise')


const access = {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaSI6Im9hdXRoY2xpZW50XzAwMDA5RXozQkRHamN1TVI5VVdZODkiLCJleHAiOjE0ODA4MDUwMjUsImlhdCI6MTQ4MDc4MzQyNSwianRpIjoidG9rXzAwMDA5RXo5SnprbnFOc0JaRTl1YnAiLCJ1aSI6InVzZXJfMDAwMDlDcHZCVkZxN0dSRHh3STBBYiIsInYiOiIyIn0.6R9Lll8L1oUkBpecR_9nYjmyWMSM-CVwxO23pWuI7dA",
  "client_id": "oauthclient_00009Ez3BDGjcuMR9UWY89",
  "expires_in": 21599,
  "token_type": "Bearer",
  "user_id": "user_00009CpvBVFq7GRDxwI0Ab"
}

const proto = 'https://'
const apiRoot = 'api.monzo.com'

request({
  uri: `${proto}${apiRoot}/accounts`,
  headers: {
    'Authorization': `Bearer ${access.access_token}`
  },
  json: true
}).then((json) => {
  request({
    uri: `${proto}${apiRoot}/balance`,
    qs: {
      'account_id': json.accounts[0].id
    },
    headers: {
      'Authorization': `Bearer ${access.access_token}`
    },
    json: true
  }).then((json) => {
    document.querySelector('p').textContent += `£${json.balance / 100}`
  })
})
