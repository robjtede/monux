'use strict'

const thisDoc = document.currentScript.ownerDocument

document.addEventListener('DOMContentLoaded', () => {
  // scope styles
  window.ShadyCSS.prepareTemplate(thisDoc.querySelector('template'), 'm-transaction')

  window.customElements.define('m-transaction', class extends HTMLElement {
    constructor () {
      super()

      this.debug = false
      if (this.debug) console.log('constructing')

      this.description = 'untitled'
      this.amount = 0

      this.attachShadow({mode: 'open'})
      this.root = this.shadowRoot

      const template = thisDoc.querySelector('template')
      this.root.appendChild(template.content.cloneNode(true))
    }

    connectedCallback () {
      if (this.debug) console.log('connected')

      this.render()
      window.ShadyCSS.applyStyle(this)
    }

    render () {
      if (this.debug) console.log('rendering')
      this.root.querySelector('.description').textContent = this.description
      this.root.querySelector('.amount').textContent = (this.amount / 100).toFixed(2)
      this.root.querySelector('.index').textContent = this.index
    }

    disconnectedCallback () {
      if (this.debug) console.log('disconnection')
    }

    adpotedCallback () {
      if (this.debug) console.log('adopted')
    }

    static get observedAttributes () {
      return ['description', 'amount', 'index']
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
      if (this.debug) console.log('attribute changed')
      const changes = {
        description: () => { this.description = newVal },
        amount: () => { this.amount = newVal },
        index: () => { this.index = newVal }
      }

      if (attrName in changes) changes[attrName]()

      this.render()
    }
  })
})
