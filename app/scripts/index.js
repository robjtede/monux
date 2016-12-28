'use strict'

const strftime = require('date-fns/format')
const startOfDay = require('date-fns/start_of_day')
const isToday = require('date-fns/is_today')
const isYesterday = require('date-fns/is_yesterday')
const isThisYear = require('date-fns/is_this_year')

const Config = require('electron-config')
const config = new Config()

const Monzo = require('../lib/monzo/Monzo')

const monzo = new Monzo(config.get('accessToken'))
const debug = true

document.addEventListener('DOMContentLoaded', () => {
  Array.from(document.querySelectorAll('.fixable')).forEach(function (el) {
    window.Stickyfill.add(el)
  })

  monzo.accounts
    .then(accs => accs[0].transactions)
    .then(txs => {
      if (debug) console.log(txs)

      txs = txs.reverse()
      const txsel = document.querySelector('.transactions')

      txs.forEach((tx, index) => {
        const txel = document.createElement('m-transaction')
        txel.tx = tx
        txel.dataset.index = index
        txsel.appendChild(txel)
      })

      const headingLocations = txs.reduce((firsts, tx, index) => {
        const created = new Date(tx.created)
        const isoDate = startOfDay(created).toISOString()

        if (!(isoDate in firsts)) {
          firsts[isoDate] = document.querySelector(`m-transaction[data-index="${index}"]`)
        }

        return firsts
      }, {})

      Object.keys(headingLocations).forEach(txel => {
        txel = headingLocations[txel]

        const day = document.createElement('div')
        day.classList.add('day-heading')

        const created = startOfDay(new Date(txel.tx.created))

        if (isToday(created)) {
          day.textContent = 'Today'
        } else if (isYesterday(created)) {
          day.textContent = 'Yesterday'
        } else if (isThisYear(created)) {
          day.textContent = strftime(created, 'dddd, Do MMMM')
        } else {
          day.textContent = strftime(created, 'dddd, Do MMMM YYYY')
        }

        txsel.insertBefore(day, txel)
      })
    })

  monzo.accounts
    .then(accs => accs[0].balance)
    .then(bal => {
      if (debug) console.log(bal)

      document.querySelector('.card-balance').querySelector('h2').innerHTML = format(bal.balance, bal.currency)
      document.querySelector('.spent-today').querySelector('h2').innerHTML = format(Math.abs(bal.spend_today), bal.currency)
    })
})

const format = (amount, currency) => {
  amount /= 100

  if (amount < 0) amount = Math.abs(amount).toFixed(2)
  else amount = amount.toFixed(2)

  const parts = amount.split('.')
  amount = `<span class="major">${parts[0]}</span>.${parts[1]}`

  const currencies = {
    'GBP': '£',
    'USD': '$',
    'EUR': '€'
  }

  return `${currencies[currency] || ''}${amount}`
}
