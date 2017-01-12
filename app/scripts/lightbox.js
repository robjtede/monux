'use strict'

document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.querySelector('.lightbox')
  const lightboxImg = lightbox.querySelector('img')

  Array.from(document.querySelectorAll('.lighboxable')).forEach(item => {
    item.addEventListener('click', ev => {
      ev.preventDefault()

      lightboxImg.src = item.querySelector('img').src
      lightbox.classList.add('show')
    })
  })

  lightbox.addEventListener('click', ev => {
    ev.preventDefault()

    lightbox.classList.remove('show')
  })
})
