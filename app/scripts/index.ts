import devtron = require('devtron')
import context = require('electron-contextmenu-middleware')
import imageMenu = require('electron-image-menu')

devtron.install()

context.use(imageMenu)
context.activate()

document.addEventListener('DOMContentLoaded', async () => {
  const $header = document.querySelector('header') as HTMLElement
  const $balance = $header.querySelector(
    '.card-balance h2'
  ) as HTMLHeadingElement
  const $spentToday = $header.querySelector(
    '.spent-today h2'
  ) as HTMLHeadingElement

  store.subscribe(() => {
    const state = store.getState()

    const balance = new Amount(state.balance.native, state.balance.local)
    const spentToday = state.spent
      ? new Amount(state.spent.native, state.spent.local)
      : undefined

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
  })
})
