'use strict'

// const {remote} = require('electron')

const Config = require('electron-config')
const config = new Config()

const Monzo = require('../Monzo')

const monzo = new Monzo(config.get('accessToken'))
const debug = false

document.addEventListener('DOMContentLoaded', () => {
  monzo.accounts
    .then(accs => accs[0].transactions)
    .then(trs => {
      console.log(trs)

      trs.reverse().forEach((tr, index) => {
        const trans = document.createElement('m-transaction')
        trans.setAttribute('index', index)
        trans.setAttribute('description', tr.merchant ? tr.merchant.name : tr.description)
        trans.setAttribute('amount', tr.amount)

        document.body.appendChild(trans)
      })
    })

  monzo.accounts
    .then(accs => accs[0].balance)
    .then(tr => {
      document.querySelector('p').textContent += `${tr.balance}`
    })
})
