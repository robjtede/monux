'use strict'

;(function (ownerDocument) {
  class TransactionAttachmentComponent extends HTMLElement {
    constructor () {
      super()

      this._debug = false
      this.debug('attachment')

      this.root = this.attachShadow({mode: 'open'})

      const template = ownerDocument.querySelector('template')
      this.root.appendChild(document.importNode(template.content, true))

      this.tx = null
      this.attachment = null
    }

    connectedCallback () {
      this.debug(`connected attachment`)

      this.src = this.attachment.url

      this.render()
    }

    render () {
      this.debug(`rendering attachment`)

      const $img = this.root.querySelector('img-exif')
      $img.src = this.src

      const $delete = this.root.querySelector('.delete')
      $delete.addEventListener('click', ev => {
        ev.preventDefault()

        this.tx
          .deregisterAttachment(this.attachment.id)
          .then(res => {
            this.parentNode.removeChild(this)
          })
          .catch(err => {
            throw err
          })
      })

      // bind lightbox to attachments
      const $lightbox = document.querySelector('.lightbox')
      const $lightboxImg = $lightbox.querySelector('img')

      $img.classList.add('lightboxable')
      $img.addEventListener('click', ev => {
        ev.preventDefault()

        $lightboxImg.src = $img.blobUrl
        $lightbox.classList.add('show')
      })
    }

    get src () {
      return this.getAttribute('src')
    }

    set src (val) {
      this.setAttribute('src', val)
    }

    disconnectedCallback () {
      this.debug(`disconnection attachment`)
    }

    adoptedCallback () {
      this.debug(`adopted attachment`)
    }

    static get observedAttributes () {
      return ['src']
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
      this.debug(`attribute changed on attachment: ${attrName}, ${oldVal} => ${newVal}`)

      const changes = {
        src: () => { if (oldVal !== newVal) this.render() }
      }

      if (attrName in changes) changes[attrName]()
    }

    debug (msg) {
      if (this._debug) console.log(msg)
    }

    static get is () {
      return 'm-transaction-attachment'
    }
  }

  window.customElements.define(TransactionAttachmentComponent.is, TransactionAttachmentComponent)
})(document.currentScript.ownerDocument)
