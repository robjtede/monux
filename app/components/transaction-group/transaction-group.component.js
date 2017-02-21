'use strict'

;(function (thisDoc) {
  const Amount = require('../lib/monzo/Amount')
  const strftime = require('date-fns').format
  const {
    startOfDay,
    isToday,
    isYesterday,
    isThisYear
  } = require('date-fns')

  const template = thisDoc.querySelector('template')

  class TransactionGroupComponent extends HTMLElement {
    constructor () {
      super()

      this.debug = false
      if (this.debug) console.log('constructing group')

      this.attachShadow({mode: 'open'})
      this.root = this.shadowRoot

      this.root.appendChild(document.importNode(template.content, true))

      this.$list = null

      this.txs = {}
      this.subtotal = 0
    }

    connectedCallback () {
      if (this.debug) console.log(`connected ${this.index} group`)

      this.dataset.index = this.index

      this.render()
    }

    render () {
      if (this.debug) console.log(`rendering ${this.index} group`)

      this.renderHeading()
      this.renderTransactions()
    }

    renderHeading () {
      const heading = this.root.querySelector('.m-transaction-group-heading')

      const created = startOfDay(this.txs[0].created)

      if (isToday(created)) {
        heading.textContent = 'Today'
      } else if (isYesterday(created)) {
        heading.textContent = 'Yesterday'
      } else if (isThisYear(created)) {
        heading.textContent = strftime(created, 'dddd, Do MMMM')
      } else {
        heading.textContent = strftime(created, 'dddd, Do MMMM YYYY')
      }

      const subtotal = this.txs
        .filter(tx => {
          if (tx.is.metaAction || tx.declined) return false
          return true
        })
        .reduce((sum, tx) => {
          return tx.amount.positive
          ? sum
          : sum + tx.amount.raw
        }, 0)

      this.subtotal = new Amount({
        raw: subtotal,
        currency: 'GBP'
      })

      heading.setAttribute('subtotal', this.subtotal.normalize)
      heading.setAttribute('currency', this.txs[0].amount.symbol)

      this.root.appendChild(heading)
    }

    renderTransactions () {
      this.txs
        .filter(tx => {
          if (!this.showHidden && tx.hidden) return false
          return true
        })
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
      if (this.debug) console.log(`disconnection ${this.index} group`)
    }

    adoptedCallback () {
      if (this.debug) console.log(`adopted ${this.index} group`)
    }

    static get observedAttributes () {
      return []
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
      if (this.debug) console.log(`attribute changed on ${this.index}: ${attrName}, ${oldVal} => ${newVal} group`)

      const changes = {}

      if (attrName in changes) changes[attrName]()

      this.render()
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.customElements.define('m-transaction-group', TransactionGroupComponent)
  })
})(document.currentScript.ownerDocument)
