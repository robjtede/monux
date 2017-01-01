'use strict'

;(function (thisDoc) {
  document.addEventListener('DOMContentLoaded', () => {
    // scope styles
    window.ShadyCSS.prepareTemplate(thisDoc.querySelector('template'), 'm-transaction-list')

    window.customElements.define('m-transaction-list', class extends HTMLElement {
      constructor () {
        super()

        this.debug = false
        if (this.debug) console.log('constructing')

        this.txs = []
      }

      connectedCallback () {
        if (this.debug) console.log(`connected list`)

        this.attachShadow({mode: 'open'})
        this.root = this.shadowRoot

        const template = thisDoc.querySelector('template')
        this.root.appendChild(document.importNode(template.content, true))

        window.ShadyCSS.applyStyle(this)

        this.render()
      }

      render () {
        if (this.debug) console.log(`rendering list`)
      }

      disconnectedCallback () {
        if (this.debug) console.log(`disconnection list`)
      }

      adoptedCallback () {
        if (this.debug) console.log(`adopted list`)
      }

      static get observedAttributes () {
        return []
      }

      attributeChangedCallback (attrName, oldVal, newVal) {
        if (this.debug) console.log(`attribute changed on list: ${attrName}, ${oldVal} => ${newVal}`)
        const changes = {}

        if (attrName in changes) changes[attrName]()

        this.render()
      }
    })
  })
})(document.currentScript.ownerDocument)
