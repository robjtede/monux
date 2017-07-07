'use strict'
;(function (ownerDocument) {
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

      this.render()

      this.addEventListener('click', this.clickHandler.bind(this))
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

      if (this.tx.pending) this.classList.add('pending')

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
      }
    }

    get index () {
      return this.dataset.index
    }

    clickHandler () {
      this.debug(`clicked ${this.index} summary`)

      const $detailPane = document.querySelector('.transaction-detail-pane')
      const $txDetail = document.querySelector('m-transaction-detail')

      $txDetail.$summary = this
      $txDetail.tx = this.tx
      $txDetail.dataset.category = this.tx.category
      $txDetail.dataset.index = this.index
      $txDetail.render()

      $detailPane.classList.remove('inactive')

      const $selectedTx = this.$txlist.selectedTransaction

      if ($selectedTx) $selectedTx.classList.remove('selected')
      this.classList.add('selected')
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
