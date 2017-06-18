document.addEventListener('DOMContentLoaded', () => {
  const $app = document.querySelector('main') as HTMLElement
  const $nav = document.querySelector('nav') as HTMLElement

  const allTabs = Array.from($nav.querySelectorAll('.tab')) as HTMLElement[]
  const allPanes = Array.from(
    $app.querySelectorAll('.app-pane')
  ) as HTMLElement[]

  allTabs.forEach(tab => {
    tab.addEventListener('click', (ev: MouseEvent) => {
      ev.stopPropagation()

      const pane = $app.querySelector(
        `.app-pane.${tab.dataset.pane}-pane`
      ) as HTMLElement

      allTabs.forEach(tab => tab.classList.remove('active'))
      allPanes.forEach(pane => pane.classList.remove('active'))

      tab.classList.add('active')
      pane.classList.add('active')
    })
  })
})
