const request = require('request-promise')
const Monzo = require('./Monzo')

const monzo = new Monzo(Monzo.authorize())

monzo.accounts
  .then(accs => accs[0])
  .then(acc => {
    acc.transactions.then(trs => {
      console.log(trs)
      trs.forEach(tr => {
        document.querySelector('pre').textContent += `${tr.description}: ${tr.amount}\n`
      })
    })
  })
