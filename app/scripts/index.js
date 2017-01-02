'use strict'

// const strftime = require('date-fns/format')
// const startOfDay = require('date-fns/start_of_day')
// const isToday = require('date-fns/is_today')
// const isYesterday = require('date-fns/is_yesterday')
// const isThisYear = require('date-fns/is_this_year')

const Config = require('electron-config')
const config = new Config()

const Monzo = require('../lib/monzo/Monzo')

const monzo = new Monzo(config.get('accessToken'))
const debug = true

document.addEventListener('DOMContentLoaded', () => {
  Array.from(document.querySelectorAll('.fixable')).forEach(function (el) {
    window.Stickyfill.add(el)
  })

  const app = document.querySelector('.app')

  const txlist = document.createElement('m-transaction-list')

  monzo
    .accounts
    .then(accs => accs[0].transactions)
    .then(txs => {
      if (debug) console.log(txs)

      txlist.txs = txs.reverse()
      app.insertBefore(txlist, app.firstChild)

      // const headingLocations = txs.reduce((firsts, tx, index) => {
      //   const created = new Date(tx.created)
      //   const isoDate = startOfDay(created).toISOString()
      //
      //   if (!(isoDate in firsts)) {
      //     firsts[isoDate] = document.querySelector(`m-transaction-summary[data-index="${index}"]`)
      //   }
      //
      //   return firsts
      // }, {})

      // Object.keys(headingLocations).forEach(txel => {
      //   console.log(txel)
      //   txel = headingLocations[txel]
      //
      //   const day = document.createElement('div')
      //   day.classList.add('day-heading')
      //
      //   const created = startOfDay(new Date(txel.tx.created))
      //
      //   if (isToday(created)) {
      //     day.textContent = 'Today'
      //   } else if (isYesterday(created)) {
      //     day.textContent = 'Yesterday'
      //   } else if (isThisYear(created)) {
      //     day.textContent = strftime(created, 'dddd, Do MMMM')
      //   } else {
      //     day.textContent = strftime(created, 'dddd, Do MMMM YYYY')
      //   }
      //
      //   txlist.insertBefore(day, txel)
      // })
    })

  monzo.accounts
    .then(accs => accs[0].balance)
    .then(({balance, spentToday}) => {
      if (debug) console.log(balance)
      if (debug) console.log(spentToday)

      document.querySelector('.card-balance').querySelector('h2').innerHTML = balance.html(true, 0)
      document.querySelector('.spent-today').querySelector('h2').innerHTML = spentToday.html(true, 0)
    })
})
