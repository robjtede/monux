import { setPane } from '../actions'
import store from '../store'

document.addEventListener('DOMContentLoaded', () => {
  const $app = document.querySelector('main') as HTMLElement
  const $nav = document.querySelector('nav') as HTMLElement

  const $tabs = Array.from($nav.querySelectorAll('.tab')) as HTMLElement[]
  const $panes = Array.from($app.querySelectorAll('.pane')) as HTMLElement[]

  $tabs.forEach($tab => {
    $tab.addEventListener('click', (ev: MouseEvent) => {
      ev.stopPropagation()

      store.dispatch(setPane($tab.dataset.pane))
    })
  })

  store.subscribe(() => {
    const { activePane } = store.getState()

    $tabs.forEach($tab => $tab.classList.remove('active'))
    $panes.forEach($pane => $pane.classList.remove('active'))

    const $tab = $nav.querySelector(
      `.tab[data-pane=${activePane}]`
    ) as HTMLElement
    const $pane = $app.querySelector(`.pane.${activePane}-pane`) as HTMLElement

    $tab.classList.add('active')
    $pane.classList.add('active')
  })
})
