import { Account, Amount, Monzo } from '../../lib/monzo'
import { getSavedCode } from '../../lib/monzo/auth'

import setTouchBar from './touchbar'
import cache, { ICacheAccount } from './cache'

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
  const cachedBank = getCachedAccount()

  return async (): Promise<Amount> => {
    const { native, local } = JSON.parse((await cachedBank).balance)
    return new Amount(native, local)
  }
})()

export const updateAccountCache = async (acc: Account, balance: Amount) => {
  return cache.accounts.put({
    id: acc.id,
    balance: balance.json,
    name: acc.name,
    type: 'Monzo'
  })
}

document.addEventListener('DOMContentLoaded', async () => {
  const $header = document.querySelector('header') as HTMLElement
  const $nav = document.querySelector('nav') as HTMLElement
  const $balance = $header.querySelector(
    '.card-balance h2'
  ) as HTMLHeadingElement
  const $spentToday = $header.querySelector(
    '.spent-today h2'
  ) as HTMLHeadingElement
  const $accDescription = $nav.querySelector('.person') as HTMLDivElement

  const updateBalances = (balance?: Amount, spentToday?: Amount) => {
    if ((balance && !balance.foreign) || (spentToday && !spentToday.foreign)) {
      if (balance) $balance.innerHTML = balance.html(true, 0)
      if (spentToday) $spentToday.innerHTML = spentToday.html(true, 0)
    } else {
      if (balance) {
        $balance.innerHTML =
          (balance.exchanged as Amount).html(true, 0) + balance.html(true, 0)
      }
      if (spentToday) {
        $spentToday.innerHTML =
          (spentToday.exchanged as Amount).html(true, 0) +
          spentToday.html(true, 0)
      }
    }

    setTouchBar(balance, spentToday)
  }

  const updateAccountInfo = (account: ICacheAccount | Account) => {
    $accDescription.textContent = account.name
  }

  const renderCachedBalance = async () => {
    console.time('render cached balance')
    try {
      const cachedBank = await getCachedAccount()
      updateAccountInfo(cachedBank)

      const cachedBalance = await getCachedBalance()
      updateBalances(cachedBalance)
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
      updateAccountInfo(acc)
      updateBalances(balance, spentToday)
    } catch (err) {
      console.error(err)
    }
    console.timeEnd('render HTTP balance')
  }

  renderCachedBalance()
  renderHTTPBalance()
})
