'use strict'
;(function (ownerDocument) {
  const { store } = require('./store')

  class AccountComponent extends HTMLElement {
    connectedCallback () {
      this._debug = false
      this.debug('connected account')

      this.root = this.attachShadow({ mode: 'open' })

      const template = ownerDocument.querySelector('template')
      this.root.appendChild(document.importNode(template.content, true))

      this.body = this.root.querySelector('.body')

      store.subscribe(() => {
        const state = store.getState()

        this.setAttribute('name', state.account.name)
        this.setAttribute('bank', state.account.bank)
      })

      this.render()
    }

    render () {
      this.debug('rendering account')

      if (!(this.name && this.bank)) return

      this.body.textContent = this.name
      this.body.dataset.bank = this.bank
    }

    get name () {
      return this.getAttribute('name')
    }

    get bank () {
      return this.getAttribute('bank')
    }

    disconnectedCallback () {
      this.debug('disconnection account')
    }

    adoptedCallback () {
      this.debug('adopted account')
    }

    static get observedAttributes () {
      return ['name', 'bank']
    }

    attributeChangedCallback (attr, oldVal, newVal) {
      this.debug(`attribute changed on amount: ${attr}, ${oldVal} => ${newVal}`)

      const changes = {
        name: () => {
          if (oldVal !== newVal) this.render()
        },
        bank: () => {
          if (oldVal !== newVal) this.render()
        }
      }

      if (attr in changes) changes[attr]()
    }

    debug (msg) {
      if (this._debug) console.info(msg)
    }

    static get is () {
      return 'm-account'
    }
  }

  window.customElements.define(AccountComponent.is, AccountComponent)
})(document.currentScript.ownerDocument)
