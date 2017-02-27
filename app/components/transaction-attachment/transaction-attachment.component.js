'use strict'

;(function (thisDoc) {
  const template = thisDoc.querySelector('template')

  class TransactionAttachmentComponent extends HTMLElement {
    constructor () {
      super()

      this.debug = false
      if (this.debug) console.log('attachmen')

      this.attachShadow({mode: 'open'})
      this.root = this.shadowRoot

      this.root.appendChild(document.importNode(template.content, true))

      this.tx = null
      this.attachment = null
    }

    connectedCallback () {
      if (this.debug) console.log(`connected attachment`)

      this.src = this.attachment.url

      this.render()
    }

    render () {
      if (this.debug) console.log(`rendering attachment`)

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
      if (this.debug) console.log(`disconnection attachment`)
    }

    adoptedCallback () {
      if (this.debug) console.log(`adopted attachment`)
    }

    static get observedAttributes () {
      return ['src']
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
      if (this.debug) console.log(`attribute changed on attachment: ${attrName}, ${oldVal} => ${newVal}`)

      const changes = {
        src: () => { if (oldVal !== newVal) this.render() }
      }

      if (attrName in changes) changes[attrName]()
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.customElements.define('m-transaction-attachment', TransactionAttachmentComponent)
  })
})(document.currentScript.ownerDocument)
