'use strict'

;(function (thisDoc) {
  const fs = require('fs')

  const strftime = require('date-fns').format
  const {
    startOfDay,
    isToday,
    isYesterday,
    isThisYear
  } = require('date-fns')

  const template = thisDoc.querySelector('template')

  class TransactionListComponent extends HTMLElement {
    constructor () {
      super()

      this.debug = false
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

      if (this.dayHeadings) {
        const groupedByDay = this.txs
          .filter(tx => {
            if (!this.showHidden && tx.hidden) return false
            return true
          })
          .reduce((groups, tx, index) => {
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
            heading.setAttribute('currency', txgroup[0].amount.symbol)

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

                if (!tx.is.metaAction && tx.amount.negative) {
                  if (heading.hasAttribute('group-total')) {
                    const current = Number(heading.getAttribute('group-total'))
                    const added = current + tx.amount.amount

                    heading.setAttribute('group-total', added.toFixed(2))
                  } else {
                    heading.setAttribute('group-total', tx.amount.normalize)
                  }
                } else {
                  heading.setAttribute('group-total', Number(0).toFixed(2))
                }

                day.appendChild(txel)
              })

            this.root.insertBefore(day, this.root.firstChild)
            // window.Stickyfill.add(heading)
          })
      } else {
        this.txs.forEach((tx, index) => {
          const txel = document.createElement('m-transaction-summary')
          txel.tx = tx

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
      return ['dayheadings', 'showhidden']
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
      if (!this.isConnected) return
      if (this.debug) console.log(`attribute changed on list: ${attrName}, ${oldVal} => ${newVal || 'undefined'}`)

      const changes = {
        dayheadings: () => { this.dayHeadings = this.hasAttribute('dayheadings') },
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
