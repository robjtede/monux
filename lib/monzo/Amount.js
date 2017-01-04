'use strict'

const currencies = {
  'GBP': {symbol: '£', separator: '.'},
  'USD': {symbol: '$', separator: '.'},
  'EUR': {symbol: '€', separator: '.'}
}

class Amount {
  constructor (raw, currency) {
    this.raw = Number(raw)
    this.currency = currency.toUpperCase()
  }

  // returns true if negative amount
  get negative () {
    return this.raw <= 0
  }

  get positive () {
    return !this.negative
  }

  // returns sign
  get sign () {
    return this.negative ? '-' : '+'
  }

  get signIfPositive () {
    return this.positive ? '+' : ''
  }

  get signIfNegative () {
    return this.negative ? '-' : ''
  }

  // returns currency symbol
  get symbol () {
    return this.currency in currencies ? currencies[this.currency].symbol : ''
  }

  // return currency separator
  get separator () {
    return this.currency in currencies ? currencies[this.currency].separator : ''
  }

  // returns amount in major units (no normalization)
  get amount () {
    return Math.abs(this.raw) / this.scale
  }

  get normalize () {
    return this.amount.toFixed(2)
  }

  // returns amount split into major and minor units
  get split () {
    return String(this.normalize).split('.')
  }

  // returns major unit
  get major () {
    return this.split[0]
  }

  // returns minor unit
  get minor () {
    return this.split[1]
  }

  // return number of minor units in major
  get scale () {
    return 100
  }

  // returns html formatted string
  html (showCurrency = true, signMode = 1) {
    let str = '<span class="major">%j</span>'
    str += '<span class="separator">%p</span>'
    str += '<span class="minor">%n</span>'

    if (showCurrency) str = '<span class="currency">%y</span>' + str

    const signModes = {
      0: '',
      1: '<span class="sign">%s</span>',
      2: '<span class="sign">%+</span>',
      3: '<span class="sign">%-</span>'
    }

    str = signModes[signMode] + str
    str = this.format(str)

    const el = document.createElement('span')
    el.classList.add('amount')
    el.classList.add(this.positive ? 'positive' : 'negative')
    el.innerHTML = str

    return el.outerHTML
  }

  // format currency with a strftime-like syntax
  // replacements
  // %s => sign
  // %c => currency
  // %s => currency symbol
  //
  // %+ => sign if positive
  // %- => sign if negative
  //
  // %r => raw amount
  // %a => locally formatted amount
  //
  // %j => major
  // %n => minor
  // %p => separator
  format (formatString = '%s%y%j%p%n') {
    let str = formatString

    str = str.replace(/%s/g, this.sign)
    str = str.replace(/%c/g, this.currency)
    str = str.replace(/%y/g, this.symbol)

    str = str.replace(/%\+/g, this.signIfPositive)
    str = str.replace(/%-/g, this.signIfNegative)

    str = str.replace(/%r/g, this.raw)
    str = str.replace(/%a/g, this.amount)

    str = str.replace(/%j/g, this.major)
    str = str.replace(/%n/g, this.minor)
    str = str.replace(/%p/g, this.separator)

    return str
  }

  toString () {
    return this.format()
  }

  valueOf () {
    return this.raw
  }
}

module.exports = Amount
