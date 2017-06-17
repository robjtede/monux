'use strict'
;(function (ownerDocument) {
  class TransactionAttachmentComponent extends HTMLElement {
    constructor () {
      super()

      this._debug = false
      this.debug('attachment')

      this.root = this.attachShadow({ mode: 'open' })

      const template = ownerDocument.querySelector('template')
      this.root.appendChild(document.importNode(template.content, true))
    }

    connectedCallback () {
      this.debug('connected attachment')

      this.$img = this.root.querySelector('img-exif')
      this.$lightbox = document.querySelector('.lightbox')
      this.$lightboxImg = this.$lightbox.querySelector('img')
      this.$delete = this.root.querySelector('.delete')

      this.src = this.attachment.url
      this.$img.src = this.src

      // this.render()
    }

    render () {
      this.debug('rendering attachment')

      this.$delete.addEventListener('click', async ev => {
        ev.preventDefault()

        try {
          await this.tx.deregisterAttachment(this.attachment.id)

          this.parentNode.removeChild(this)
        } catch (err) {
          console.error(err)
          throw new Error(err)
        }
      })

      // bind lightbox to image
      this.$img.classList.add('lightboxable')
      this.$img.addEventListener('click', async ev => {
        ev.preventDefault()

        this.$lightboxImg.src = await this.$img.blobUrl
        this.$lightbox.classList.add('show')
      })
    }

    get src () {
      return this.getAttribute('src')
    }

    set src (val) {
      this.setAttribute('src', val)
    }

    disconnectedCallback () {
      this.debug('disconnection attachment')
    }

    adoptedCallback () {
      this.debug('adopted attachment')
    }

    static get observedAttributes () {
      return ['src']
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
      this.debug(
        `attribute changed on attachment: ${attrName}, ${oldVal} => ${newVal}`
      )

      const changes = {
        src: () => {
          if (oldVal !== newVal) this.render()
        }
      }

      if (attrName in changes) changes[attrName]()
    }

    debug (msg) {
      if (this._debug) console.info(msg)
    }

    static get is () {
      return 'm-transaction-attachment'
    }
  }

  window.customElements.define(
    TransactionAttachmentComponent.is,
    TransactionAttachmentComponent
  )
})(document.currentScript.ownerDocument)
