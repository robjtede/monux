document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.querySelector('.lightbox') as HTMLDivElement
  const lightboxImg = lightbox.querySelector('img') as HTMLImageElement

  Array.from(document.querySelectorAll('.lighboxable')).forEach(item => {
    item.addEventListener('click', (ev: MouseEvent) => {
      ev.preventDefault()

      const source = item.querySelector('img')

      if (source) {
        lightboxImg.src = source.src
        lightbox.classList.add('show')
      }
    })
  })

  lightbox.addEventListener('click', (ev: MouseEvent) => {
    ev.preventDefault()

    lightbox.classList.remove('show')
  })
})
