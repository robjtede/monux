'use strict'

;(function (ownerDocument) {
  const { Amount } = require('../lib/monzo')

  class TransactionGroupComponent extends HTMLElement {
    constructor () {
      super()

      this._debug = false
      this.debug('constructing group')

      this.root = this.attachShadow({mode: 'open'})

      const template = ownerDocument.querySelector('template')
      this.root.appendChild(document.importNode(template.content, true))

      this.$list = null

      this.txs = []
      this.subtotal = 0
      this.label = 'No Group Label'
    }

    connectedCallback () {
      this.debug(`connected ${this.index} group`)

      this.dataset.label = this.label

      this.render()
    }

    render () {
      this.debug(`rendering ${this.index} group`)

      this.renderHeading()
      this.renderTransactions()
    }

    renderHeading () {
      const heading = this.root.querySelector('.m-transaction-group-heading')

      heading.textContent = this.label

      const subtotal = this.txs
      .filter(tx => {
        if (tx.is.metaAction || tx.declined) return false
        return true
      })
      .reduce((sum, tx) => {
        return tx.amount.positive
        ? sum
        : sum + tx.amount.native.amount
      }, 0)

      this.subtotal = new Amount({
        amount: subtotal,
        currency: 'GBP'
      })

      heading.setAttribute('subtotal', this.subtotal.normalize)
      heading.setAttribute('currency', this.txs[0].amount.symbol)

      this.root.appendChild(heading)
    }

    renderTransactions () {
      this.txs
        .sort((a, b) => b.created - a.created)
        .forEach(tx => {
          const $tx = document.createElement('m-transaction-summary')

          $tx.$list = this.$list
          $tx.$group = this
          $tx.tx = tx

          this.root.appendChild($tx)
        })
    }

    disconnectedCallback () {
      this.debug(`disconnection ${this.index} group`)
    }

    adoptedCallback () {
      this.debug(`adopted ${this.index} group`)
    }

    static get observedAttributes () {
      return []
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
      this.debug(`attribute changed on ${this.index}: ${attrName}, ${oldVal} => ${newVal} group`)

      const changes = {}

      if (attrName in changes) changes[attrName]()

      this.render()
    }

    debug (msg) {
      if (this._debug) console.info(msg)
    }

    static get is () {
      return 'm-transaction-group'
    }
  }

  window.customElements.define(TransactionGroupComponent.is, TransactionGroupComponent)
})(document.currentScript.ownerDocument)
