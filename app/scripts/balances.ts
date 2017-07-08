import { Amount, Monzo } from '../../lib/monzo'
import { getSavedCode } from '../../lib/monzo/auth'

import setTouchBar from './touchbar'
import cache from './cache'

const getMonzo = (() => {
  const accessToken = getSavedCode('access_token')

  return async (): Promise<Monzo> => {
    return new Monzo(await accessToken)
  }
})()

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

  const accounts = await (await getMonzo()).accounts

  console.time('render cached balance')
  try {
    const cachedBank = (await cache.banks.limit(1).toArray())[0]
    const { native, local } = JSON.parse(cachedBank.balance)
    const balance = new Amount(native, local)

    $accDescription.textContent = cachedBank.name

    if (!balance.foreign) {
      $balance.innerHTML = balance.html(true, 0)
    } else {
      $balance.innerHTML =
        (balance.exchanged as Amount).html(true, 0) + balance.html(true, 0)
    }

    setTouchBar(balance)
  } catch (err) {
    console.error(err)
  }
  console.timeEnd('render cached balance')

  console.time('render HTTP balance')
  try {
    const acc = accounts[0]
    const { balance, spentToday } = await acc.balance

    await cache.banks.put({
      accId: acc.id,
      balance: balance.json,
      name: acc.name,
      type: 'Monzo'
    })

    $accDescription.textContent = acc.name

    if (!balance.foreign) {
      $balance.innerHTML = balance.html(true, 0)
      $spentToday.innerHTML = spentToday.html(true, 0)
    } else {
      $balance.innerHTML =
        (balance.exchanged as Amount).html(true, 0) + balance.html(true, 0)
      $spentToday.innerHTML =
        (spentToday.exchanged as Amount).html(true, 0) +
        spentToday.html(true, 0)
    }

    setTouchBar(balance, spentToday)
  } catch (err) {
    console.error(err)
  }
  console.timeEnd('render HTTP balance')
})
