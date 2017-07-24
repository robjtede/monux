'use strict'
;(function (ownerDocument) {
  const { default: db } = require('./scripts/cache')
  const { updateTransaction, selectTransaction } = require('./actions')
  const { store } = require('./store')

  class TransactionSummaryComponent extends HTMLElement {
    constructor () {
      super()

      this._debug = false
      this.debug('constructing summary')

      this.root = this.attachShadow({ mode: 'open' })

      const template = ownerDocument.querySelector('template')
      this.root.appendChild(document.importNode(template.content, true))

      this.$txlist = document.querySelector('m-transaction-list')
    }

    connectedCallback () {
      this.debug(`connected ${this.index} summary`)

      this.dataset.category = this.tx.category
      this.dataset.index = this.tx.index

      this.addEventListener('click', this.clickHandler.bind(this))

      store.subscribe(() => {
        const { selectedTransaction } = store.getState()

        if (selectedTransaction === this.tx.id) this.classList.add('selected')
        else this.classList.remove('selected')

        this.render()
      })

      this.render()
    }

    render () {
      this.debug(`rendering ${this.index} summary`)

      const $amountWrap = this.root.querySelector('.amount-wrap')
      const $amount = this.root.querySelector('.amount')
      const $merchant = this.root.querySelector('.merchant')
      const $notes = this.root.querySelector('.notes')

      const $metaAttachments = this.root.querySelector('.meta-attachments')

      $merchant.textContent = this.tx.displayName

      if (this.tx.notes.short.trim()) {
        $notes.classList.add('noted')
      } else {
        $notes.classList.remove('noted')
      }
      $notes.textContent = this.tx.notes.short

      if (!this.tx.is.metaAction && !this.tx.declined) {
        $amountWrap.innerHTML = this.tx.amount.html(false, 2)

        if (this.tx.amount.foreign) {
          $amountWrap.innerHTML += this.tx.amount.exchanged.html(true, 2)
        }

        if (this.tx.amount.positive && $amount) $amount.classList.add('income')
      } else {
        let $hider = this.root.querySelector('.hider')
        if ($hider) $hider.parentNode.removeChild($hider)

        $hider = document.createElement('div')
        $hider.classList.add('hider')
        $hider.innerHTML = '&#10761;'

        $hider.addEventListener('click', ev => {
          ev.stopPropagation()
          this.hide()
        })

        $amountWrap.classList.add('hidable')
        $amountWrap.appendChild($hider)
      }

      const icon = this.root.querySelector('.icon')
      icon.src = this.tx.icon
      icon.addEventListener('error', ev => {
        icon.src = this.tx.iconFallback
      })

      if (this.tx.pending) {
        this.classList.add('pending')
      } else {
        this.classList.remove('pending')
      }

      if (this.tx.declined) {
        this.classList.add('declined')
        $notes.classList.add('noted')
        $notes.textContent = this.tx.declineReason
      }

      if (this.tx.attachments.length) {
        this.classList.add('attachments')

        $metaAttachments.setAttribute(
          'data-attachments',
          this.tx.attachments.length
        )
      } else {
        this.classList.remove('attachments')

        $metaAttachments.removeAttribute('data-attachments')
      }
    }

    get index () {
      return this.dataset.index
    }

    clickHandler () {
      this.debug(`clicked ${this.index} summary`)

      store.dispatch(selectTransaction(this.tx.id))

      const $detailPane = document.querySelector('.transaction-detail-pane')

      // TODO: this only fires first time because `monzo` and `acc` are side
      // effects in `scripts/transactions.ts`
      if (this.tx.acc) {
        this.debug(`updating transaction ${this.tx.id}`)

        this.tx.acc
          .transaction(this.tx.id)
          .then(tx => {
            store.dispatch(updateTransaction(tx.json))

            return db.transactions.put({
              id: tx.id,
              created_at: tx.created,
              accId: tx.acc.id,
              json: tx.stringify
            })
          })
          .then(cache => {
            this.debug(`updated cached ${this.tx.id}`)
          })
          .catch(err => {
            console.error(err)
          })
      }

      $detailPane.classList.remove('inactive')
    }

    async hide () {
      const tx = await this.tx.annotate('monux_hidden', 'true')

      this.parentNode.removeChild(this)

      return tx
    }

    disconnectedCallback () {
      this.debug(`disconnection ${this.index} summary`)
    }

    adoptedCallback () {
      this.debug(`adopted ${this.index} summary`)
    }

    static get observedAttributes () {
      return []
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
      this.debug(
        `attribute changed on ${this
          .index}: ${attrName}, ${oldVal} => ${newVal} summary`
      )

      const changes = {}

      if (attrName in changes) changes[attrName]()

      this.render()
    }

    debug (msg) {
      if (this._debug) console.info(msg)
    }

    static get is () {
      return 'm-transaction-summary'
    }
  }

  window.customElements.define(
    TransactionSummaryComponent.is,
    TransactionSummaryComponent
  )
})(document.currentScript.ownerDocument)
