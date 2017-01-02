'use strict'

;(function (thisDoc) {
  class TransactionSummaryComponent extends HTMLElement {
    constructor (tx = {}) {
      super()

      this.debug = false
      if (this.debug) console.log('constructing summary')

      this.tx = tx
    }

    connectedCallback () {
      if (this.debug) console.log(`connected ${this.index} summary`)

      this.attachShadow({mode: 'closed'})
      this.root = this.shadowRoot

      const template = thisDoc.querySelector('template')
      this.root.appendChild(document.importNode(template.content, true))

      window.ShadyCSS.applyStyle(this)

      this.render()

      this.addEventListener('click', this.clickHandler.bind(this))
    }

    render () {
      if (this.debug) console.log(`rendering ${this.index} summary`)

      this.root.querySelector('.merchant').textContent = this.tx.displayName

      if (this.tx.notes.short.trim()) {
        this.root.querySelector('.notes').classList.add('noted')
        this.root.querySelector('.notes').textContent = this.tx.notes.short
      }

      this.root.querySelector('.amount-wrap').innerHTML = this.tx.amount.html(false, 2)
      if (this.tx.amount.positive) this.root.querySelector('.amount').classList.add('income')

      this.root.querySelector('.icon').src = this.tx.icon

      if (this.tx.declined) this.classList.add('declined')
      if (this.tx.pending) this.classList.add('pending')

      this.dataset.category = this.tx.category
    }

    get index () {
      return this.dataset.index
    }

    clickHandler () {
      if (this.debug) console.log(`clicked ${this.index} summary`)
      const thisDetail = document.createElement('m-transaction-detail')

      thisDetail.tx = this.tx
      thisDetail.dataset.index = this.index

      if (document.querySelector('.transaction-detail-pane')) document.querySelector('.transaction-detail-pane').innerHTML = ''
      document.querySelector('.transaction-detail-pane').appendChild(thisDetail)
    }

    disconnectedCallback () {
      if (this.debug) console.log(`disconnection ${this.index} summary`)
    }

    adoptedCallback () {
      if (this.debug) console.log(`adopted ${this.index} summary`)
    }

    static get observedAttributes () {
      return []
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
      if (this.debug) console.log(`attribute changed on ${this.index}: ${attrName}, ${oldVal} => ${newVal} summary`)
      const changes = {}

      if (attrName in changes) changes[attrName]()

      this.render()
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // scope styles
    window.ShadyCSS.prepareTemplate(thisDoc.querySelector('template'), 'm-transaction-summary')

    window.customElements.define('m-transaction-summary', TransactionSummaryComponent)
  })
})(document.currentScript.ownerDocument)
