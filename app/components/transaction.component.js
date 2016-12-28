'use strict'

;(function (thisDoc) {
  document.addEventListener('DOMContentLoaded', () => {
    // scope styles
    window.ShadyCSS.prepareTemplate(thisDoc.querySelector('template'), 'm-transaction')

    window.customElements.define('m-transaction', class extends HTMLElement {
      constructor (tx = {}) {
        super()

        this.debug = false
        if (this.debug) console.log('constructing')

        this.tx = tx
      }

      connectedCallback () {
        if (this.debug) console.log(`connected ${this.index}`)

        this.attachShadow({mode: 'open'})
        this.root = this.shadowRoot

        const template = thisDoc.querySelector('template')
        this.root.appendChild(document.importNode(template.content, true))

        window.ShadyCSS.applyStyle(this)

        this.render()

        this.addEventListener('click', this.clickHandler.bind(this))
      }

      render () {
        if (this.debug) console.log(`rendering ${this.index}`)

        this.root.querySelector('.merchant').textContent = this.merchantName

        if (this.notes.trim() !== '') {
          this.root.querySelector('.notes').classList.add('noted')
          this.root.querySelector('.notes').textContent = this.notes
        }

        this.root.querySelector('.amount').textContent = this.amount
        if (this.tx.amount >= 0) this.root.querySelector('.amount').classList.add('income')

        this.root.querySelector('.icon').src = this.icon

        if (this.declined) this.classList.add('declined')
        if (this.pending) this.classList.add('pending')

        this.dataset.category = this.tx.category
      }

      get index () {
        return this.dataset.index
      }

      get merchantName () {
        if ('merchant' in this.tx && this.tx.merchant && this.tx.merchant.name) {
          return this.tx.merchant.name
        } else return this.tx.description
      }

      get notes () {
        return this.tx.notes.split('\n')[0]
      }

      get pending () {
        // declined transactions are never pending
        if (this.declined) return false

        // cash is never pending
        if (this.isCash) return false

        // all income seems to be exempt?
        if (this.tx.amount >= 0) return false

        // if settled does not exists
        if (!('settled' in this.tx)) return true

        // or if settled field is empty
        if ('settled' in this.tx && this.tx.settled.trim() === '') return true

        // assume transaction is not pending
        return false
      }

      get declined () {
        return 'decline_reason' in this.tx
      }

      get isCash () {
        return this.tx.category === 'cash'
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

        if (
          'merchant' in this.tx &&
          this.tx.merchant &&
          'logo' in this.tx.merchant &&
          this.tx.merchant.logo
        ) {
          return this.tx.merchant.logo
        }

        return `./icons/${this.tx.category}.png`
      }

      clickHandler () {
        if (this.debug) console.log(`clicked ${this.index}`)
        const thisDetail = document.createElement('m-transaction-detail')

        thisDetail.tx = this.tx
        thisDetail.dataset.index = this.index

        if (document.querySelector('.transaction-detail-pane')) document.querySelector('.transaction-detail-pane').innerHTML = ''
        document.querySelector('.transaction-detail-pane').appendChild(thisDetail)
        console.log(thisDetail)
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
