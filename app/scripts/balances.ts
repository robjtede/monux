import * as Debug from 'debug'

import { getBalance, loadBalance } from '../actions'
import store from '../store'

const debug = Debug('app:scripts:balance')

document.addEventListener('DOMContentLoaded', async () => {
  const $header = document.querySelector('header') as HTMLElement
  const $balance = $header.querySelector(
    '.card-balance m-amount'
  ) as HTMLElement
  const $spent = $header.querySelector('.spent-today m-amount') as HTMLElement

  store.subscribe(() => {
    const { balance, spent } = store.getState()

    $balance.setAttribute('amount', balance.native.amount.toFixed())
    $balance.setAttribute('currency', balance.native.currency)
    if (balance.local) {
      $balance.setAttribute('localAmount', balance.local.amount.toFixed())
      $balance.setAttribute('localCurrency', balance.local.currency)
    }

    $spent.setAttribute('amount', spent.native.amount.toFixed())
    $spent.setAttribute('currency', spent.native.currency)
    if (spent.local) {
      $spent.setAttribute('localAmount', spent.local.amount.toFixed())
      $spent.setAttribute('localCurrency', spent.local.currency)
    }
  })
})

store.dispatch(loadBalance())
store.dispatch(getBalance())
