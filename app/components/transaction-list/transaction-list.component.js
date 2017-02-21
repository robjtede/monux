'use strict'

;(function (thisDoc) {
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

      const groupIds = {
        day: (groups, tx, index) => {
          const created = new Date(tx.created)
          return +startOfDay(created)
        },

        merchant: (groups, tx, index) => {
          return tx.tx.merchant ? tx.tx.merchant.group_id : 'other'
        }
      }

      const grouped = this.txs.reduce((groups, tx, index) => {
        const groupId = groupIds[this.groupBy || 'none'](groups, tx, index)

        if (groupId in groups) groups[groupId].push(tx)
        else groups[groupId] = [tx]

        return groups
      }, {})

      const sortGroupsBy = {
        day: (a, b) => b[0] - a[0],

        merchant: (a, b) => {
          const atot = a[1].filter(tx => {
            if (tx.is.metaAction || tx.declined) return false
            return true
          })
          .reduce((sum, tx) => {
            return tx.amount.positive
            ? sum
            : sum + tx.amount.raw
          }, 0)

          const btot = b[1].filter(tx => {
            if (tx.is.metaAction || tx.declined) return false
            return true
          })
          .reduce((sum, tx) => {
            return tx.amount.positive
            ? sum
            : sum + tx.amount.raw
          }, 0)

          return atot - btot
        }
      }

      Object.entries(grouped)
        .sort((a, b) => sortGroupsBy[this.groupBy || 'none'](a, b))
        .forEach(([key, group]) => {
          const $group = document.createElement('m-transaction-group')

          $group.$list = this
          $group.txs = group

          const groupByLabels = {
            day: tx => {
              const created = startOfDay(tx.created)

              if (isToday(created)) {
                return 'Today'
              } else if (isYesterday(created)) {
                return 'Yesterday'
              } else if (isThisYear(created)) {
                return strftime(created, 'dddd, Do MMMM')
              } else {
                return strftime(created, 'dddd, Do MMMM YYYY')
              }
            },

            merchant: tx => {
              return tx.merchant.name
            }
          }

          $group.label = groupByLabels[this.groupBy || 'none'](group[0])

          this.root.appendChild($group)
        })
    }

    get groupBy () {
      return 'day'
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
