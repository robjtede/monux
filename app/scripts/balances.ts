import { Account, Amount, Monzo } from '../../lib/monzo'
import { getSavedCode } from '../../lib/monzo/auth'

import cache, { ICacheAccount } from './cache'

import { setBalance, setSpent, setAccount } from '../actions'
import store from '../store'

const getMonzo = (() => {
  const accessToken = getSavedCode('access_token')

  return async (): Promise<Monzo> => {
    return new Monzo(await accessToken)
  }
})()

export const getCachedAccount = (() => {
  const cachedAccount = cache.accounts.limit(1).toArray()

  return async (): Promise<ICacheAccount> => {
    return (await cachedAccount)[0]
  }
})()

export const getCachedBalance = (() => {
  const cachedAccount = getCachedAccount()

  return async (): Promise<Amount> => {
    const { native, local } = JSON.parse((await cachedAccount).balance)

    return new Amount(native, local)
  }
})()

export const updateAccountCache = async (acc: Account, balance: Amount) => {
  return cache.accounts.put({
    id: acc.id,
    balance: balance.stringify,
    name: acc.name,
    type: 'Monzo'
  })
}

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

      store.dispatch(setAccount(cachedAccount.name, cachedAccount.type))
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
