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
      if (this.debug) console.log(`connected detail`)

      if (this.tx) {
        this.dataset.category = this.tx.category
        this.render()
      }

      const $attachments = this.root.querySelector('.attachments')
      const $scrollInner = $attachments.querySelector('.scroll-inner')
      const $newAttachment = this.root.querySelector('input.new-attachment')

      $newAttachment.addEventListener('change', ev => {
        ev.preventDefault()

        const contentType = 'image/jpeg'

        this.tx
          .requestAttachmentUpload(contentType)
          .then(urls => {
            if (this.debug) console.log('got attachment upload url')

            return Promise.all([fetch(urls.upload_url, {
              method: 'PUT',
              headers: {
                'Content-Type': contentType
              },
              body: $newAttachment.files[0]
            }), urls])
          })
          .then(([res, urls]) => {
            if (!res.ok) throw new Error('Not able to upload')

            return this.tx.registerAttachment(urls.file_url, contentType)
          })
          .then(res => {
            if (this.debug) console.log('registered attachment')

            const $attachment = document.createElement('m-transaction-attachment')

            $attachment.tx = this.tx
            $attachment.attachment = res.attachment

            $scrollInner.insertBefore($attachment, $scrollInner.firstChild)
          })
          .catch(err => {
            console.log(err)
            throw err
          })
      })
    }

    render () {
      if (!this.tx) return
      if (this.debug) console.log(`rendering detail`)

      this.renderCategory()
      this.renderIcon()
      this.renderLocation()
      this.renderMerchant()
      this.renderNotes()
      this.renderAttachments()
      this.renderAmount()
      this.renderBalance()
      this.renderDate()
      this.renderId()
      this.renderDescription()
    }

    renderBalance () {
      const balance = this.tx.balance.html(true, 0)
      this.root.querySelector('.balance-wrap').innerHTML = balance
    }

    renderDate () {
      const date = strftime(this.tx.created, 'h:mma - Do MMMM YYYY')
      this.root.querySelector('.date').textContent = date
    }

    renderId () {
      const id = this.tx.id
      this.root.querySelector('.id').textContent = id
    }

    renderDescription () {
      const description = this.tx.description
      this.root.querySelector('.description').textContent = description
    }

    renderAmount () {
      const $amountWrap = this.root.querySelector('.amount-wrap')

      if (!this.tx.is.metaAction) {
        $amountWrap.innerHTML = this.tx.amount.html(true, 0)

        if (this.tx.amount.foreign) {
          $amountWrap.innerHTML += this.tx.amount.local.html(true, 0)
        }
      }
    }

    renderSettled () {
      const $settled = this.root.querySelector('.settled')

      if (this.tx.settled === 'Settled: Invalid Date') {
        console.warn('Invalid settled date. This may be a bug.')
        $settled.classList.add('meta')
      }

      if (this.tx.is.metaAction) {
        $settled.classList.add('meta')
      } else {
        $settled.classList.remove('meta')
        $settled.textContent = this.tx.settled
      }
    }

    renderDeclined () {
      if (this.tx.declined) {
        this.classList.add('declined')
        this.root.querySelector('.decline-reason').textContent = this.tx.declineReason
      } else {
        this.classList.remove('declined')
      }
    }

    renderIcon () {
      const $icon = this.root.querySelector('.icon')

      $icon.src = this.tx.icon
      $icon.addEventListener('error', ev => {
        $icon.src = this.tx.iconFallback
      })
    }

    renderCategory () {
      const $category = this.root.querySelector('.category')

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
    }

    renderLocation () {
      const $location = this.root.querySelector('.location')

      if (!this.tx.location || this.tx.location.toLowerCase() === 'online') {
        $location.style.display = 'none'
      } else {
        $location.style.display = 'block'
        $location.textContent = this.tx.location
      }
    }

    renderMerchant () {
      const $merchant = this.root.querySelector('.merchant')

      $merchant.textContent = this.tx.displayName
      if (this.tx.online) {
        $merchant.classList.add('online')
      } else {
        $merchant.classList.remove('online')
      }
    }

    renderNotes () {
      const $notesWrap = this.root.querySelector('.notes-wrap')
      const $notes = $notesWrap.querySelector('textarea.notes')
      const $addNote = $notesWrap.querySelector('a')

      $notes.disabled = this.offline

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
        console.log('edit handler')

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
      const $attachments = this.root.querySelector('.attachments')
      const $scrollInner = $attachments.querySelector('.scroll-inner')
      const $newAttachment = this.root.querySelector('input.new-attachment')

      Array.from($scrollInner.childNodes).forEach($attachment => {
        $attachment.parentNode.removeChild($attachment)
      })

      $newAttachment.disabled = this.offline

      // loop through attachment urls
      this.tx.attachments.reverse().forEach(attachment => {
        const $attachment = document.createElement('m-transaction-attachment')

        $attachment.tx = this.tx
        $attachment.attachment = attachment

        $scrollInner.appendChild($attachment)
      })
    }

    get index () {
      return this.dataset.index
    }

    get offline () {
      return this.hasAttribute('offline')
    }

    disconnectedCallback () {
      if (this.debug) console.log(`disconnection detail`)
    }

    adoptedCallback () {
      if (this.debug) console.log(`adopted detail`)
    }

    static get observedAttributes () {
      return ['offline']
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
      if (this.debug) console.log(`attribute changed on detail: ${attrName}, ${oldVal} => ${newVal}`)

      const changes = {
        offline: () => { if (oldVal !== newVal) this.render() }
      }

      if (attrName in changes) changes[attrName]()
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.customElements.define('m-transaction-detail', TransactionDetailComponent)
  })
})(document.currentScript.ownerDocument)
