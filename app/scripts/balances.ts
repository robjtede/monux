import * as Debug from 'debug'

import { getMonzo } from '../../lib/monzo'
import { getCachedAccount, getCachedBalance, updateAccountCache } from './cache'

import { setBalance, setSpent, setAccount } from '../actions'
import store from '../store'

const debug = Debug('app:renderer:balance')

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

  const renderCachedBalance = async () => {
    console.time('render cached balance')
    try {
      const cachedAccount = await getCachedAccount()
      const cachedBalance = await getCachedBalance()

      debug('cached balance =>', cachedBalance)

      store.dispatch(setAccount('monzo', cachedAccount.acc))
      store.dispatch(setBalance(cachedBalance.json))
    } catch (err) {
      console.error(err)
    }
    console.timeEnd('render cached balance')
  }

  const renderHTTPBalance = async () => {
    console.time('render HTTP balance')
    try {
      const acc = (await (await getMonzo()).accounts)[0]
      const { balance, spentToday } = await acc.balance

      updateAccountCache(acc, balance)

      debug('HTTP balance =>', balance)

      store.dispatch(setAccount('monzo', acc.json))
      store.dispatch(setBalance(balance.json))
      store.dispatch(setSpent(spentToday.json))
    } catch (err) {
      console.error(err)
    }
    console.timeEnd('render HTTP balance')
  }

  renderCachedBalance()
  renderHTTPBalance()
})
