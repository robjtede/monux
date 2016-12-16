'use strict'

const thisDoc = document.currentScript.ownerDocument

document.addEventListener('DOMContentLoaded', () => {
  // scope styles
  window.ShadyCSS.prepareTemplate(thisDoc.querySelector('template'), 'm-transaction')

  window.customElements.define('m-transaction', class extends HTMLElement {
    constructor () {
      super()

      this.debug = false
      if (this.debug) console.log(`constructing ${this.index}`)

      this.transaction = this.transaction || {}

      this.attachShadow({mode: 'open'})
      this.root = this.shadowRoot

      const template = thisDoc.querySelector('template')
      this.root.appendChild(template.content.cloneNode(true))
    }

    connectedCallback () {
      if (this.debug) console.log(`connected ${this.index}`)

      window.ShadyCSS.applyStyle(this)
      this.render()
    }

    render () {
      if (this.debug) console.log(`rendering ${this.index}`)

      this.root.querySelector('.description').textContent = this.description

      if (this.notes.trim() !== '') {
        this.root.querySelector('.notes').classList.add('noted')
        this.root.querySelector('.notes').textContent = this.notes
      }

      this.root.querySelector('.amount').textContent = this.amount
      if (this.transaction.amount >= 0) this.root.querySelector('.amount').classList.add('income')

      this.root.querySelector('.icon').src = this.icon

      if ('decline_reason' in this.transaction) this.classList.add('declined')
    }

    get description () {
      if ('merchant' in this.transaction && this.transaction.merchant && this.transaction.merchant.name) {
        return this.transaction.merchant.name
      } else return this.transaction.description
    }

    get notes () {
      return this.transaction.notes.split('\n')[0]
    }

    get amount () {
      let amount = this.transaction.amount / 100

      if (amount < 0) amount = `${Math.abs(amount).toFixed(2)}`
      else amount = `+${amount.toFixed(2)}`

      return amount
    }

    formatCurrency (amount) {
      const currencies = {
        'GBP': '£',
        'USD': '$',
        'EUR': '€'
      }

      return `${currencies[this.transaction.currency] || ''}${amount}`
    }

    get icon () {
      if ('is_topup' in this.transaction.metadata && this.transaction.metadata.is_topup) {
        return './icons/topup.png'
      }

      if ('merchant' in this.transaction && 'logo' in this.transaction.merchant && this.transaction.merchant.logo) {
        return this.transaction.merchant.logo
      }

      return `./icons/${this.transaction.category}.png`
    }

    disconnectedCallback () {
      if (this.debug) console.log(`disconnection ${this.index}`)
    }

    adpotedCallback () {
      if (this.debug) console.log(`adopted ${this.index}`)
    }

    static get observedAttributes () {
      return ['index']
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
      if (this.debug) console.log(`attribute changed ${this.index}`)
      const changes = {
        index: () => { this.index = newVal }
      }

      if (attrName in changes) changes[attrName]()

      this.render()
    }
  })
})
