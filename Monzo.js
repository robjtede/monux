const rp = require('request-promise');

class Account {
  constructor(monzo, acc) {
    this.monzo = monzo
    this.acc = acc
  }

  get id() {
    return this.acc.id
  }

  get balance() {
    return this.monzo.request('/balance', {
      'account_id': this.id
    })
  }

  get transactions() {
    return this.monzo.request('/transactions', {
      'expand[]': 'merchant',
      'account_id': this.id
    }).then(trs => trs.transactions)
  }

}

class Monzo {
  constructor(access) {
    this.proto = 'https://'
    this.apiRoot = 'api.monzo.com'
    this.access = access
  }

  request(path = '/ping/whoami', qs = {}, json = true) {
    return rp({
      uri: `${this.proto}${this.apiRoot}${path}`,
      qs: qs,
      headers: {
        'Authorization': `Bearer ${this.access.access_token}`
      },
      json: json
    })
  }

  get accounts() {
    return this.request('/accounts').then(accs => {
      return accs.accounts.map(acc => new Account(this, acc))
    })
  }

  static authorize() {
    return {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaSI6Im9hdXRoY2xpZW50XzAwMDA5RXozQkRHamN1TVI5VVdZODkiLCJleHAiOjE0ODA4MDUwMjUsImlhdCI6MTQ4MDc4MzQyNSwianRpIjoidG9rXzAwMDA5RXo5SnprbnFOc0JaRTl1YnAiLCJ1aSI6InVzZXJfMDAwMDlDcHZCVkZxN0dSRHh3STBBYiIsInYiOiIyIn0.6R9Lll8L1oUkBpecR_9nYjmyWMSM-CVwxO23pWuI7dA",
      "client_id": "oauthclient_00009Ez3BDGjcuMR9UWY89",
      "expires_in": 21599,
      "token_type": "Bearer",
      "user_id": "user_00009CpvBVFq7GRDxwI0Ab"
    }
  }
}

module.exports = Monzo
