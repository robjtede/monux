'use strict'

;(function (thisDoc) {
  const strftime = require('date-fns').format

  const template = thisDoc.querySelector('template')

  class TransactionDetailComponent extends HTMLElement {
    constructor () {
      super()

      this.debug = false
      if (this.debug) console.log('constructing')

      this.attachShadow({mode: 'open'})
      this.root = this.shadowRoot

      this.root.appendChild(document.importNode(template.content, true))

      this.$summary = null

      this.tx = null
    }

    connectedCallback () {
      if (this.debug) console.log(`connected ${this.index} detail`)

      if (this.tx) {
        this.dataset.category = this.tx.category
        this.render()
      }
    }

    render () {
      if (this.debug) console.log(`rendering ${this.index} detail`)

      this.renderLocation()
      this.renderNotes()
      this.renderAttachments()

      const $amountWrap = this.root.querySelector('.amount-wrap')
      const $category = this.root.querySelector('.category')
      const $merchant = this.root.querySelector('.merchant')
      const $settled = this.root.querySelector('.settled')

      this.root.querySelector('.balance-wrap').innerHTML = this.tx.balance.html(true, 0)
      this.root.querySelector('.date').textContent = strftime(this.tx.created, 'h:mma - Do MMMM YYYY')
      this.root.querySelector('.id').textContent = this.tx.id
      this.root.querySelector('.description').textContent = this.tx.description

      $merchant.textContent = this.tx.displayName
      if (this.tx.online) {
        $merchant.classList.add('online')
      } else {
        $merchant.classList.remove('online')
      }

      const icon = this.root.querySelector('.icon')
      icon.src = this.tx.icon
      icon.addEventListener('error', ev => {
        icon.src = this.tx.iconFallback
      })

      $category.textContent = this.tx.category.formatted
      if (this.tx.merchant.emoji) {
        $category.setAttribute('emoji', this.tx.merchant.emoji)
        $category.classList.remove('noemoji')
      } else {
        $category.classList.add('noemoji')
      }
      $category.addEventListener('click', ev => {
        ev.preventDefault()

        this.$summary.$list.setAttribute('filter-category', this.tx.category)
      })

      if (!this.tx.is.metaAction) {
        $amountWrap.innerHTML = this.tx.amount.html(true, 0)

        if (this.tx.amount.foreign) {
          $amountWrap.innerHTML += this.tx.amount.local.html(true, 0)
        }
      }

      if (this.tx.is.metaAction) {
        $settled.classList.add('meta')
      } else {
        $settled.classList.remove('meta')
        $settled.textContent = this.tx.settled
      }

      if (this.tx.settled === 'Settled: Invalid Date') {
        console.warn('Invalid settled date. This may be a bug.')
        $settled.classList.add('meta')
      }

      if (this.tx.declined) {
        this.classList.add('declined')
        this.root.querySelector('.decline-reason').textContent = this.tx.declineReason
      } else {
        this.classList.remove('declined')
      }
    }

    renderLocation () {
      const location = this.root.querySelector('.location')

      if (!this.tx.location || this.tx.location.toLowerCase() === 'online') {
        location.style.display = 'none'
        return
      }

      location.textContent = this.tx.location
    }

    renderNotes () {
      const $notes = this.root.querySelector('.notes')
      const $notesWrap = this.root.querySelector('.notes-wrap')
      const $addNote = this.root.querySelector('.notes-wrap a')

      const updateNotes = () => {
        if (this.tx.notes.full) {
          $notesWrap.classList.add('noted')
        } else {
          $notesWrap.classList.remove('noted')

          $addNote.addEventListener('click', ev => {
            ev.preventDefault()

            $notesWrap.classList.add('noted')
            $notes.focus()
            calcSize()
          })
        }

        $notes.textContent = this.tx.notes.full
        $notes.value = this.tx.notes.full
      }

      updateNotes()

      const calcSize = () => {
        $notes.style.height = '1px'
        $notes.style.height = $notes.scrollHeight
      }

      setTimeout(calcSize.bind(this), 0)
      $notes.addEventListener('keydown', calcSize)
      $notes.addEventListener('keyup', calcSize)
      $notes.addEventListener('paste', calcSize)

      const editHandler = ev => {
        this.tx
          .setNotes($notes.value.trim())
          .then(() => {
            updateNotes()
            this.$summary.render()
          })
      }

      $notes.addEventListener('blur', editHandler)
    }

    renderAttachments () {
      const attachments = this.root.querySelector('.attachments')

      Array.from(attachments.querySelectorAll('img-exif')).forEach(attachment => {
        attachment.parentNode.removeChild(attachment)
      })

      if (this.tx.attachments.length) {
        attachments.style.display = 'block'
      } else {
        attachments.style.display = 'none'
        return
      }

      const scrollInner = document.createElement('div')
      scrollInner.classList.add('scroll-inner')

      attachments.querySelector('.scroll-wrap').appendChild(scrollInner)

      // loop through attachment urls
      this.tx.attachments.reverse().forEach(url => {
        const img = document.createElement('img-exif')
        img.setAttribute('src', url)
        img.classList.add('lightboxable')

        scrollInner.appendChild(img)

        // bind lightbox to attachments
        const lightbox = document.querySelector('.lightbox')
        const lightboxImg = lightbox.querySelector('img')

        img.classList.add('lightboxable')
        img.addEventListener('click', ev => {
          ev.preventDefault()

          lightboxImg.src = img.blobUrl
          lightbox.classList.add('show')
        })
      })
    }

    get index () {
      return this.dataset.index
    }

    disconnectedCallback () {
      if (this.debug) console.log(`disconnection ${this.index} detail`)
    }

    adoptedCallback () {
      if (this.debug) console.log(`adopted ${this.index} detail`)
    }

    static get observedAttributes () {
      return []
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
      if (this.debug) console.log(`attribute changed on ${this.index} detail: ${attrName}, ${oldVal} => ${newVal}`)
      const changes = {}

      if (attrName in changes) changes[attrName]()

      this.render()
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.customElements.define('m-transaction-detail', TransactionDetailComponent)
  })
})(document.currentScript.ownerDocument)
