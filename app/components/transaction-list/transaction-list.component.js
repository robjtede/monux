'use strict'

;(function (thisDoc) {
  const {
    startOfDay
  } = require('date-fns')

  const template = thisDoc.querySelector('template')

  class TransactionListComponent extends HTMLElement {
    constructor () {
      super()

      this.debug = true
      if (this.debug) console.log('constructing list')

      this.attachShadow({mode: 'open'})
      this.root = this.shadowRoot

      this.root.appendChild(document.importNode(template.content, true))

      this.txs = []
    }

    connectedCallback () {
      if (this.debug) console.log(`connected list`)

      this.render()
    }

    render () {
      if (this.debug) console.log(`rendering list`)
      Array.from(this.root.querySelectorAll('m-transaction-group')).forEach(group => {
        group.parentNode.removeChild(group)
      })

      const grouped = this.txs.reduce((groups, tx, index) => {
        const created = new Date(tx.created)
        const dayid = +startOfDay(created)

        if (dayid in groups) groups[dayid].push(tx)
        else groups[dayid] = [tx]

        return groups
      }, {})

      Object.entries(grouped)
        .sort((a, b) => b[0] - a[0])
        .forEach(([key, group]) => {
          const $group = document.createElement('m-transaction-group')

          $group.$list = this
          $group.index = key
          $group.txs = group

          this.root.appendChild($group)
        })
    }

    disconnectedCallback () {
      if (this.debug) console.log(`disconnection list`)
    }

    adoptedCallback () {
      if (this.debug) console.log(`adopted list`)
    }

    static get observedAttributes () {
      return ['groupheadings', 'showhidden']
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
      if (!this.isConnected) return
      if (this.debug) console.log(`attribute changed on list: ${attrName}, ${oldVal} => ${newVal || 'undefined'}`)

      const changes = {
        groupheadings: () => { this.dayHeadings = this.hasAttribute('groupheadings') },
        showhidden: () => { this.showHidden = this.hasAttribute('showhidden') }
      }

      if (attrName in changes) changes[attrName]()

      this.render()
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.customElements.define('m-transaction-list', TransactionListComponent)
  })
})(document.currentScript.ownerDocument)
