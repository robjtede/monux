'use strict'

;(function (thisDoc) {
  const EXIF = require('../lib/exif')

  const template = thisDoc.querySelector('template')

  class ImageExif extends HTMLElement {
    constructor () {
      super()

      this.debug = false
      if (this.debug) console.log('constructing')

      this.attachShadow({mode: 'open'})
      this.root = this.shadowRoot

      this.root.appendChild(document.importNode(template.content, true))
    }

    connectedCallback () {
      if (this.debug) console.log('connected img-exif')

      if (this.src) this.render()
    }

    render () {
      if (this.debug) console.log('rendering img-exif')

      // create canvas for image
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      const $this = this

      // parse image for orientation
      EXIF.getData({src: this.src}, function (imgBuffer) {
        if (this.debug) console.log('got EXIF data', this.src, imgBuffer)

        // get orientation
        const orientation = EXIF.getTag(this, 'Orientation')

        if ($this.debug) console.log(`orientation code: ${orientation}`)

        // convert buffer to blob
        const arrayBufferView = new Uint8Array(imgBuffer)
        const blob = new Blob([arrayBufferView], {type: 'image/jpeg'})

        // create blob url
        const urlCreator = window.URL || window.webkitURL
        const imageUrl = urlCreator.createObjectURL(blob)

        // create virtual Image with blob src
        const img = new Image()
        img.src = imageUrl

        img.onload = () => {
          if ($this.debug) console.log('blob image loaded')

          // if image dimensions have changed
          if ([5, 6, 7, 8].includes(orientation)) {
            canvas.width = img.height
            canvas.height = img.width
          } else {
            canvas.width = img.width
            canvas.height = img.height
          }

          // possible orientation effects
          const orientations = {
            1: () => ctx.transform(1, 0, 0, 1, 0, 0),
            2: () => ctx.transform(-1, 0, 0, 1, img.width, 0),
            3: () => ctx.transform(-1, 0, 0, -1, img.width, img.height),
            4: () => ctx.transform(1, 0, 0, -1, 0, img.height),
            5: () => ctx.transform(0, 1, 1, 0, 0, 0),
            6: () => ctx.transform(0, 1, -1, 0, img.height, 0),
            7: () => ctx.transform(0, -1, -1, 0, img.height, img.width),
            8: () => ctx.transform(0, -1, 1, 0, 0, img.width)
          }

          // apply orientation to canvas
          orientations[orientation || 1]()

          // draw image to canvas
          ctx.drawImage(img, 0, 0)

          // create new image element to be inserted
          const $img = $this.root.querySelector('img')

          if (canvas.height > canvas.width) {
            $img.height = '350'
          } else {
            $img.width = '350'
          }

          // get blob of canvas
          canvas.toBlob(blob => {
            if ($this.debug) console.log('canvas blobified')

            const blobUrl = URL.createObjectURL(blob)

            $this.blobUrl = blobUrl

            // output image
            $img.src = blobUrl
            $this.root.appendChild($img)
          }, 'image/jpeg')
        }
      })
    }

    get src () {
      return this.getAttribute('src')
    }

    set src (val) {
      return this.setAttribute('src', val)
    }

    disconnectedCallback () {
      if (this.debug) console.log('disconnection img-exif')
    }

    adoptedCallback () {
      if (this.debug) console.log('adopted img-exif')
    }

    static get observedAttributes () {
      return ['src']
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
      if (this.debug) console.log(`attribute changed on img-exif: ${attrName}, ${oldVal} => ${newVal}`)

      const changes = {
        src: () => {
          console.log(oldVal, newVal)
          if (oldVal !== newVal) this.render()
        }
      }

      if (attrName in changes) changes[attrName]()
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.customElements.define('img-exif', ImageExif)
  })
})(document.currentScript.ownerDocument)
