'use strict'

const EXIF = require('../lib/exif')

;(function (thisDoc) {
  const template = thisDoc.querySelector('template')

  class TransactionDetailComponent extends HTMLElement {
    constructor () {
      super()

      this.debug = false
      if (this.debug) console.log('constructing')

      this.tx = {}
    }

    connectedCallback () {
      if (this.debug) console.log(`connected ${this.index} detail`)

      this.attachShadow({mode: 'open'})
      this.root = this.shadowRoot

      this.root.appendChild(document.importNode(template.content, true))

      this.dataset.category = this.tx.category

      window.ShadyCSS.applyStyle(this)

      this.render()
    }

    render () {
      if (this.debug) console.log(`rendering ${this.index} detail`)

      this.renderLocation()
      this.renderNotes()
      this.renderAttachments()

      this.root.querySelector('.merchant').textContent = this.tx.displayName
      if (this.tx.online) this.root.querySelector('.merchant').classList.add('online')

      const icon = this.root.querySelector('.icon')
      icon.src = this.tx.icon
      icon.addEventListener('error', ev => {
        icon.src = this.tx.iconFallback
      })

      this.root.querySelector('.category').textContent = this.tx.category.formatted

      if (!this.tx.is.metaAction) this.root.querySelector('.amount-wrap').innerHTML = this.tx.amount.html(true, 0)

      this.root.querySelector('.balance-wrap').innerHTML = this.tx.balance.html(true, 0)

      this.root.querySelector('.id').textContent = this.tx.id
      this.root.querySelector('.description').textContent = this.tx.description

      if (!this.tx.is.metaAction) {
        this.root.querySelector('.settled').textContent = this.tx.settled
      } else {
        this.root.querySelector('.settled').classList.add('meta')
      }

      if (this.tx.declined) {
        this.classList.add('declined')
        this.root.querySelector('.settled').classList.add('meta')
        this.root.querySelector('.decline-reason').textContent = this.tx.declineReason
      }
    }

    renderLocation () {
      const location = this.root.querySelector('.location')

      if (!this.tx.location || this.tx.location.toLowerCase() === 'online') {
        location.style.display = 'none'
        return
      }

      location.textContent = this.tx.location
    }

    renderNotes () {
      const notes = this.root.querySelector('.notes')

      const updateNotes = () => {
        if (!this.tx.notes.full.trim()) {
          notes.style.display = 'none'
        } else {
          notes.style.display = 'block'
        }
        notes.textContent = this.tx.notes.full
      }
      updateNotes()

      const summary = document.querySelector(`m-transaction-summary[data-index="${this.index}"]`)

      const textarea = document.createElement('textarea')

      const calcSize = () => {
        textarea.style.height = '1px'
        textarea.style.height = Math.max(150, textarea.scrollHeight) + 'px'
      }

      calcSize()
      textarea.addEventListener('keydown', calcSize)
      textarea.addEventListener('keyup', calcSize)
      textarea.addEventListener('paste', calcSize)

      const button = this.root.querySelector('.notes-wrap').querySelector('.edit')

      const editHandler = ev => {
        ev.preventDefault()

        notes.style.display = 'none'
        textarea.textContent = notes.textContent
        this.root.querySelector('.notes-wrap').appendChild(textarea)
        button.textContent = 'Done'

        button.removeEventListener('click', editHandler)
        button.addEventListener('click', doneHandler)
      }

      const doneHandler = () => {
        button.textContent = 'Updating...'

        this.tx
          .setNotes(textarea.value.trim())
          .then(() => {
            updateNotes()
            summary.render()

            textarea.value = textarea.value.trim()
            textarea.textContent = textarea.value.trim()
            textarea.parentNode.removeChild(textarea)

            notes.style.display = 'block'
            button.textContent = 'Edit'
          })

        button.removeEventListener('click', doneHandler)
        button.addEventListener('click', editHandler)
      }

      button.addEventListener('click', editHandler)
    }

    renderAttachments () {
      const attachments = this.root.querySelector('.attachments')

      if (this.tx.attachments.length === 0) {
        attachments.style.display = 'none'
        return
      }

      const scrollInner = document.createElement('div')
      scrollInner.classList.add('scroll-inner')

      attachments.querySelector('.scroll-wrap').appendChild(scrollInner)

      // loop through attachment urls
      this.tx.attachments.reverse().forEach(url => {
        // create canvas for image
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        // parse image for orientation
        EXIF.getData({src: url}, function (imgBuffer) {
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
            // get orientation
            const orientation = EXIF.getTag(this, 'Orientation')

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

            // // insert image
            // scrollInner.appendChild(canvas)

            // create new image element to be inserted
            const imgEl = document.createElement('img')

            // get blob of canvas
            canvas.toBlob(blob => {
              const blobUrl = URL.createObjectURL(blob)
              imgEl.src = blobUrl

              // insert image
              scrollInner.appendChild(imgEl)
            }, 'image/jpeg')
          }
        })
      })
    }

    get index () {
      return this.dataset.index
    }

    disconnectedCallback () {
      if (this.debug) console.log(`disconnection ${this.index} detail`)
    }

    adoptedCallback () {
      if (this.debug) console.log(`adopted ${this.index} detail`)
    }

    static get observedAttributes () {
      return []
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
      if (this.debug) console.log(`attribute changed on ${this.index} detail: ${attrName}, ${oldVal} => ${newVal}`)
      const changes = {}

      if (attrName in changes) changes[attrName]()

      this.render()
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // scope styles
    window.ShadyCSS.prepareTemplate(template, 'm-transaction-detail')

    window.customElements.define('m-transaction-detail', TransactionDetailComponent)
  })
})(document.currentScript.ownerDocument)
