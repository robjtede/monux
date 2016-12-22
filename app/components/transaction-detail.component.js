'use strict'

;(function (thisDoc) {
  document.addEventListener('DOMContentLoaded', () => {
    // scope styles
    window.ShadyCSS.prepareTemplate(thisDoc.querySelector('template'), 'm-transaction-detail')

    window.customElements.define('m-transaction-detail', class extends HTMLElement {
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

        const template = thisDoc.querySelector('template')
        this.root.appendChild(document.importNode(template.content, true))

        window.ShadyCSS.applyStyle(this)

        this.render()
      }

      render () {
        if (this.debug) console.log(`rendering ${this.index} detail`)

        this.root.querySelector('.id').textContent = this.tx.id
        this.root.querySelector('.notes').textContent = this.tx.notes
        this.root.querySelector('.location').textContent = this.location
        this.root.querySelector('.attachments').innerHTML = this.attachments
        this.root.querySelector('.description').innerHTML = this.tx.description

        this.dataset.category = this.tx.category
      }

      get index () {
        return this.dataset.index
      }

      get location () {
        if (this.tx.merchant && 'online' in this.tx.merchant && this.tx.merchant.online) {
          return 'Online'
        }

        if (
          this.tx.merchant &&
          'address' in this.tx.merchant &&
          this.tx.merchant.address &&
          'short_formatted' in this.tx.merchant.address &&
          this.tx.merchant.address.short_formatted
        ) {
          return this.tx.merchant.address.short_formatted
        }

        return 'unknown'
      }

      get attachments () {
        if (!this.tx.attachments) return ''

        const div = document.createElement('div')

        this.tx.attachments.forEach(attachment => {
          const img = document.createElement('img')
          img.src = attachment.url

          div.appendChild(img)
        })

        return div.innerHTML
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
    })
  })
})(document.currentScript.ownerDocument)
