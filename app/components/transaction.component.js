'use strict'

;(function (thisDoc) {
  document.addEventListener('DOMContentLoaded', () => {
    // scope styles
    window.ShadyCSS.prepareTemplate(thisDoc.querySelector('template'), 'm-transaction')

    window.customElements.define('m-transaction', class extends HTMLElement {
      constructor () {
        super()

        this.debug = false
        if (this.debug) console.log('constructing')

        this.tx = {}
      }

      connectedCallback () {
        if (this.debug) console.log(`connected ${this.index}`)

        this.attachShadow({mode: 'open'})
        this.root = this.shadowRoot

        const template = thisDoc.querySelector('template')
        this.root.appendChild(document.importNode(template.content, true))

        window.ShadyCSS.applyStyle(this)

        this.render()

        this.addEventListener('click', this.clickCallback.bind(this))
      }

      render () {
        if (this.debug) console.log(`rendering ${this.index}`)

        this.root.querySelector('.description').textContent = this.description

        if (this.notes.trim() !== '') {
          this.root.querySelector('.notes').classList.add('noted')
          this.root.querySelector('.notes').textContent = this.notes
        }

        this.root.querySelector('.amount').textContent = this.amount
        if (this.tx.amount >= 0) this.root.querySelector('.amount').classList.add('income')

        this.root.querySelector('.icon').src = this.icon

        if ('decline_reason' in this.tx) this.classList.add('declined')
        if (!('settled' in this.tx) || ('settled' in this.tx && this.tx.settled.trim() === '')) this.classList.add('pending')

        this.dataset.category = this.tx.category
      }

      get index () {
        return this.dataset.index
      }

      get description () {
        if ('merchant' in this.tx && this.tx.merchant && this.tx.merchant.name) {
          return this.tx.merchant.name
        } else return this.tx.description
      }

      get notes () {
        return this.tx.notes.split('\n')[0]
      }

      get amount () {
        let amount = this.tx.amount / 100

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

        return `${currencies[this.tx.currency] || ''}${amount}`
      }

      get icon () {
        if ('is_topup' in this.tx.metadata && this.tx.metadata.is_topup) {
          return './icons/topup.png'
        }

        if (this.tx.counterparty && 'user_id' in this.tx.counterparty) {
          return './icons/peer.png'
        }

        if ('merchant' in this.tx && this.tx.merchant && 'logo' in this.tx.merchant && this.tx.merchant.logo) {
          return this.tx.merchant.logo
        }

        return `./icons/${this.tx.category}.png`
      }

      clickCallback () {
        if (this.debug) console.log(`clicked ${this.index}`)
        Array.from(document.querySelectorAll('m-transaction-detail')).forEach(item => {
          item.classList.remove('show')
        })

        document.querySelector(`m-transaction-detail[data-index="${this.index}"]`).classList.add('show')
      }

      disconnectedCallback () {
        if (this.debug) console.log(`disconnection ${this.index}`)
      }

      adoptedCallback () {
        if (this.debug) console.log(`adopted ${this.index}`)
      }

      static get observedAttributes () {
        return []
      }

      attributeChangedCallback (attrName, oldVal, newVal) {
        if (this.debug) console.log(`attribute changed on ${this.index}: ${attrName}, ${oldVal} => ${newVal}`)
        const changes = {}

        if (attrName in changes) changes[attrName]()

        this.render()
      }
    })
  })
})(document.currentScript.ownerDocument)
