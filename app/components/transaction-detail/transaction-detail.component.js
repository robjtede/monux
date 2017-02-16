'use strict'

;(function (thisDoc) {
  const template = thisDoc.querySelector('template')

  class TransactionDetailComponent extends HTMLElement {
    constructor () {
      super()

      this.debug = false
      if (this.debug) console.log('constructing')

      this.attachShadow({mode: 'open'})
      this.root = this.shadowRoot

      this.root.appendChild(document.importNode(template.content, true))

      this.tx = null
    }

    connectedCallback () {
      if (this.debug) console.log(`connected ${this.index} detail`)

      if (this.tx) this.dataset.category = this.tx.category

      if (this.tx) this.render()
    }

    render () {
      if (this.debug) console.log(`rendering ${this.index} detail`)

      this.renderLocation()
      this.renderNotes()
      this.renderAttachments()

      this.root.querySelector('.merchant').textContent = this.tx.displayName
      if (this.tx.online) {
        this.root.querySelector('.merchant').classList.add('online')
      } else {
        this.root.querySelector('.merchant').classList.remove('online')
      }

      const icon = this.root.querySelector('.icon')
      icon.src = this.tx.icon
      icon.addEventListener('error', ev => {
        icon.src = this.tx.iconFallback
      })

      this.root.querySelector('.category').textContent = this.tx.category.formatted
      if (this.tx.merchant.emoji) {
        this.root.querySelector('.category').setAttribute('emoji', this.tx.merchant.emoji)
        this.root.querySelector('.category').classList.remove('noemoji')
      } else {
        this.root.querySelector('.category').classList.add('noemoji')
      }

      if (!this.tx.is.metaAction) {
        this.root.querySelector('.amount-wrap').innerHTML = this.tx.amount.html(true, 0)

        if (this.tx.amount.foreign) {
          this.root.querySelector('.amount-wrap').innerHTML += this.tx.amount.local.html(true, 0)
        }
      }

      this.root.querySelector('.balance-wrap').innerHTML = this.tx.balance.html(true, 0)

      this.root.querySelector('.id').textContent = this.tx.id
      this.root.querySelector('.description').textContent = this.tx.description

      if (this.tx.is.metaAction) {
        this.root.querySelector('.settled').classList.add('meta')
      } else {
        this.root.querySelector('.settled').classList.remove('meta')
        this.root.querySelector('.settled').textContent = this.tx.settled
      }

      if (this.tx.settled === 'Settled: Invalid Date') {
        console.warn('Invalid settled date. This may be a bug.')
        this.root.querySelector('.settled').classList.add('meta')
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
      const notes = this.root.querySelector('.notes')

      const updateNotes = () => {
        if (!this.tx.notes.full.trim()) {
          notes.style.display = 'none'
        } else {
          notes.style.display = 'block'
        }
        notes.textContent = this.tx.notes.full
      }
      updateNotes()

      const summary = document.querySelector(`m-transaction-summary[data-index="${this.index}"]`)

      const textarea = document.createElement('textarea')

      const calcSize = () => {
        textarea.style.height = '1px'
        textarea.style.height = Math.max(150, textarea.scrollHeight) + 'px'
      }

      calcSize()
      textarea.addEventListener('keydown', calcSize)
      textarea.addEventListener('keyup', calcSize)
      textarea.addEventListener('paste', calcSize)

      const button = this.root.querySelector('.notes-wrap').querySelector('.edit')

      const editHandler = ev => {
        ev.preventDefault()

        notes.style.display = 'none'
        textarea.textContent = notes.textContent
        this.root.querySelector('.notes-wrap').appendChild(textarea)
        button.textContent = 'Done'

        button.removeEventListener('click', editHandler)
        button.addEventListener('click', doneHandler)
      }

      const doneHandler = () => {
        button.textContent = 'Updating...'

        this.tx
          .setNotes(textarea.value.trim())
          .then(() => {
            updateNotes()
            summary.render()

            textarea.value = textarea.value.trim()
            textarea.textContent = textarea.value.trim()
            textarea.parentNode.removeChild(textarea)

            notes.style.display = 'block'
            button.textContent = 'Edit'
          })

        button.removeEventListener('click', doneHandler)
        button.addEventListener('click', editHandler)
      }

      button.addEventListener('click', editHandler)
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
