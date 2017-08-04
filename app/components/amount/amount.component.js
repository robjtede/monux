'use strict'
;(function (ownerDocument) {
  const { Amount } = require('../lib/monzo')

  class AmountComponent extends HTMLElement {
    connectedCallback () {
      this._debug = false
      this.debug('connected amount')

      this.root = this.attachShadow({ mode: 'open' })

      const template = ownerDocument.querySelector('template')
      this.root.appendChild(document.importNode(template.content, true))

      this.body = this.root.querySelector('.body')

      this.render()
    }

    render () {
      this.debug('rendering amount')

      if (!(this.amount && this.currency)) return

      const amount =
        this.localAmount && this.localCurrency
          ? new Amount(
            {
              amount: this.amount,
              currency: this.currency
            },
            {
              amount: this.localAmount,
              currency: this.localCurrency
            }
          )
          : new Amount({
            amount: this.amount,
            currency: this.currency
          })

      this.body.innerHTML = !amount.foreign
        ? amount.html(true, 0)
        : amount.exchanged.html(true, 0) + amount.html(true, 0)
    }

    get amount () {
      return this.getAttribute('amount')
    }

    get currency () {
      return this.getAttribute('currency')
    }

    get localAmount () {
      return this.getAttribute('localAmount')
    }

    get localCurrency () {
      return this.getAttribute('localCurrency')
    }

    disconnectedCallback () {
      this.debug('disconnection amount')
    }

    adoptedCallback () {
      this.debug('adopted amount')
    }

    static get observedAttributes () {
      return ['amount', 'currency', 'localAmount', 'localCurrency']
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
      this.debug(
        `attribute changed on amount: ${attrName}, ${oldVal} => ${newVal}`
      )

      const changes = {
        amount: () => {
          if (oldVal !== newVal) this.render()
        },
        currency: () => {
          if (oldVal !== newVal) this.render()
        },
        'local-amount': () => {
          if (oldVal !== newVal) this.render()
        },
        'local-currency': () => {
          if (oldVal !== newVal) this.render()
        }
      }

      if (attrName in changes) changes[attrName]()
    }

    debug (msg) {
      if (this._debug) console.info(msg)
    }

    static get is () {
      return 'm-amount'
    }
  }

  window.customElements.define(AmountComponent.is, AmountComponent)
})(document.currentScript.ownerDocument)
