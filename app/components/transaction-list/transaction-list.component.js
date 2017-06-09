'use strict'

;(function (ownerDocument) {
  const strftime = require('date-fns').format
  const {
    startOfDay,
    isToday,
    isYesterday,
    isThisYear
  } = require('date-fns')

  class TransactionListComponent extends HTMLElement {
    constructor () {
      super()

      this._debug = false
      this.debug('constructing list')

      this.attachShadow({mode: 'open'})
      this.root = this.shadowRoot

      const template = ownerDocument.querySelector('template')
      this.root.appendChild(document.importNode(template.content, true))

      this.txs = []
    }

    connectedCallback () {
      this.debug(`connected list`)

      const $groupBy = this.root.querySelector('.group-by')
      const $filterCategory = this.root.querySelector('.filter-category')

      $groupBy.addEventListener('change', ev => {
        this.setAttribute('group-by', $groupBy.value)
      })

      $filterCategory.addEventListener('change', ev => {
        this.setAttribute('filter-category', $filterCategory.value)
      })
      window.addEventListener('keydown', this.keyHandler.bind(this))

      this.render()
    }

    render () {
      this.debug(`rendering list`)
      Array.from(this.root.querySelectorAll('m-transaction-group')).forEach(group => {
        group.parentNode.removeChild(group)
      })

      if (this.filterCategory) this.root.querySelector('.filter-category').value = this.filterCategory

      const filtered = this.txs.filter(tx => {
        if (!this.showHidden && tx.hidden) return false

        if (!this.filterCategory) return true

        if (this.filterCategory === tx.category.raw) return true
        return false
      })

      const groupIds = {
        day: (groups, tx, index) => {
          const created = new Date(tx.created)
          return +startOfDay(created)
        },

        merchant: (groups, tx, index) => {
          return tx.tx.merchant ? tx.tx.merchant.group_id : tx.tx.counterparty.user_id ? 'monzo-contacts' : 'top-ups'
        },

        none: (groups, tx, index) => {
          return 'none'
        }
      }

      const grouped = filtered.reduce((groups, tx, index) => {
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
        },

        none: (a, b) => {
          return a
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
              return tx.tx.merchant ? tx.merchant.name : tx.tx.counterparty.user_id ? 'Monzo Contacts' : 'Top Ups'
            },

            none: tx => {
              return 'unsorted'
            }
          }

          $group.label = groupByLabels[this.groupBy || 'none'](group[0])

          this.root.appendChild($group)
        })
    }

    get groupBy () {
      return this.getAttribute('group-by')
    }

    get showHidden () {
      return this.hasAttribute('show-hidden')
    }

    get groupHeadings () {
      return this.hasAttribute('group-headings')
    }

    get filterCategory () {
      return this.getAttribute('filter-category')
    }

    get allTransactions () {
      return Array.from(this.root.querySelectorAll('m-transaction-group'))
        .map(group => Array.from(group.shadowRoot.querySelectorAll('m-transaction-summary')))
        .reduce((groups, group) => [...groups, ...group], [])
    }

    get selectedTransaction () {
      const $selectedGroup = Array.from(this.root.querySelectorAll('m-transaction-group'))
        .find(group => group.shadowRoot.querySelector('m-transaction-summary.selected'))

      let $selectedTx
      if ($selectedGroup) {
        $selectedTx = $selectedGroup.shadowRoot.querySelector('m-transaction-summary.selected')
      }

      return $selectedTx
    }

    getTransactionByIndex (index = 0) {
      const $selectedGroup = Array.from(this.root.querySelectorAll('m-transaction-group'))
        .find(group => group.shadowRoot.querySelector(`m-transaction-summary[data-index="${index}"]`))

      let $tx
      if ($selectedGroup) {
        $tx = $selectedGroup.shadowRoot.querySelector(`m-transaction-summary[data-index="${index}"]`)
      }

      return $tx
    }

    keyHandler (ev) {
      const $detailPane = document.querySelector('.transaction-detail-pane')
      const $txDetail = document.querySelector('m-transaction-detail')

      const KEY_UP = 38
      const KEY_DOWN = 40

      const actions = {
        [KEY_UP]: () => {
          if (!this.selectedTransaction) {
            return this.allTransactions[this.allTransactions.length - 1]
          } else {
            const index = this.allTransactions.indexOf(this.selectedTransaction) - 1
            return this.allTransactions[index]
          }
        },

        [KEY_DOWN]: () => {
          if (!this.selectedTransaction) {
            return this.allTransactions[0]
          } else {
            const index = this.allTransactions.indexOf(this.selectedTransaction) + 1
            return this.allTransactions[index]
          }
        }
      }

      if (ev.keyCode in actions) {
        ev.preventDefault()

        const $selected = this.selectedTransaction
        const $next = actions[ev.keyCode]()

        if ($selected) {
          $selected.classList.remove('selected')
          $selected.render()
        }

        $next.classList.add('selected')
        $next.render()

        // TODO: fix odd scroll behavior
        // this.scrollTo(0, $next.getBoundingClientRect().top - 500)

        $detailPane.classList.remove('inactive')
        $txDetail.$summary = $next
        $txDetail.tx = $next.tx
        $txDetail.dataset.category = $next.tx.category
        $txDetail.dataset.index = $next.index
        $txDetail.render()
      }
    }

    disconnectedCallback () {
      this.debug(`disconnection list`)
    }

    adoptedCallback () {
      this.debug(`adopted list`)
    }

    static get observedAttributes () {
      return ['group-headings', 'show-hidden', 'group-by', 'filter-category']
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
      this.debug(`attribute changed on list: ${attrName}, ${oldVal} => ${newVal || 'undefined'}`)

      const changes = {
        'group-headings': () => {
          if (oldVal !== newVal) this.render()
        },

        'group-by': () => {
          if (oldVal !== newVal) this.render()
        },

        'filter-category': () => {
          if (oldVal !== newVal) this.render()
        },

        'show-hidden': () => {
          if (oldVal !== newVal) this.render()
        }
      }

      if (attrName in changes) changes[attrName]()
    }

    debug (msg) {
      if (this._debug) console.info(msg)
    }

    static get is () {
      return 'm-transaction-list'
    }
  }

  window.customElements.define(TransactionListComponent.is, TransactionListComponent)
})(document.currentScript.ownerDocument)
