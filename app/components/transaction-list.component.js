'use strict'

;(function (thisDoc) {
  const strftime = require('date-fns/format')
  const startOfDay = require('date-fns/start_of_day')
  const isToday = require('date-fns/is_today')
  const isYesterday = require('date-fns/is_yesterday')
  const isThisYear = require('date-fns/is_this_year')

  class TransactionListComponent extends HTMLElement {
    constructor () {
      super()

      this.debug = false
      if (this.debug) console.log('constructing list')

      this.txs = []
    }

    connectedCallback () {
      if (this.debug) console.log(`connected list`)

      this.attachShadow({mode: 'open'})
      this.root = this.shadowRoot

      const template = thisDoc.querySelector('template')
      this.root.appendChild(document.importNode(template.content, true))

      window.ShadyCSS.applyStyle(this)

      this.render()
    }

    render () {
      if (this.debug) console.log(`rendering list`)

      if (this.hasAttribute('dayheadings')) {
        const groupedByDay = this.txs.reduce((groups, tx, index) => {
          const created = new Date(tx.created)
          const dayid = +startOfDay(created)

          if (dayid in groups) groups[dayid].push(tx)
          else groups[dayid] = [tx]

          return groups
        }, {})

        Object.keys(groupedByDay)
          .sort()
          .forEach(txgroup => {
            txgroup = groupedByDay[txgroup]

            const day = document.createElement('div')
            day.classList.add('transaction-group')

            const heading = document.createElement('div')
            heading.classList.add('day-heading', 'fixable')

            const created = startOfDay(new Date(txgroup[0].created))

            if (isToday(created)) {
              heading.textContent = 'Today'
            } else if (isYesterday(created)) {
              heading.textContent = 'Yesterday'
            } else if (isThisYear(created)) {
              heading.textContent = strftime(created, 'dddd, Do MMMM')
            } else {
              heading.textContent = strftime(created, 'dddd, Do MMMM YYYY')
            }

            day.appendChild(heading)

            txgroup
              .reverse()
              .forEach(tx => {
                const txel = document.createElement('m-transaction-summary')
                txel.tx = tx

                day.appendChild(txel)
              })

            this.root.insertBefore(day, this.root.firstChild)
            window.Stickyfill.add(heading)
          })
      } else {
        this.txs.forEach((tx, index) => {
          const txel = document.createElement('m-transaction-summary')
          txel.tx = tx
          txel.dataset.index = index

          this.root.appendChild(txel)
        })
      }
    }

    disconnectedCallback () {
      if (this.debug) console.log(`disconnection list`)
    }

    adoptedCallback () {
      if (this.debug) console.log(`adopted list`)
    }

    static get observedAttributes () {
      return ['dayheadings']
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
      if (this.debug) console.log(`attribute changed on list: ${attrName}, ${oldVal} => ${newVal}`)
      const changes = {}

      if (attrName in changes) changes[attrName]()

      this.render()
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // scope styles
    window.ShadyCSS.prepareTemplate(thisDoc.querySelector('template'), 'm-transaction-list')

    window.customElements.define('m-transaction-list', TransactionListComponent)
  })
})(document.currentScript.ownerDocument)
