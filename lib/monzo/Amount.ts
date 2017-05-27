export interface ICurrency {
  symbol: string
  separator: string
}

export interface ICurrencies {
  [currencyName: string]: ICurrency
}

export interface IAmount {
  amount: number,
  currency: string
}

const currencies: ICurrencies = {
  EUR: { symbol: '€', separator: '.' },
  GBP: { symbol: '£', separator: '.' },
  USD: { symbol: '$', separator: '.' }
}

export default class Amount {
  constructor(readonly native: IAmount, readonly local?: IAmount) {}

  // returns true if not home currency
  get foreign(): boolean {
    return !!this.local
  }

  get exchanged(): Amount | undefined {
    if (this.local) return new Amount(this.local)
    else return
 }

  // returns true if negative amount
  get negative(): boolean {
    return this.native.amount <= 0
  }

  // returns true if positive amount
  get positive(): boolean {
    return !this.negative
  }

  // returns sign
  get sign(): string {
    return this.negative ? '-' : '+'
  }

  // returns sign only when positive
  get signIfPositive(): string {
    return this.positive ? '+' : ''
  }

  // returns sign only when negative
  get signIfNegative(): string {
    return this.negative ? '-' : ''
  }

  // returns currency symbol
  get symbol(): string {
    return this.native.currency in currencies ? currencies[this.native.currency].symbol : ''
  }

  // return currency separator
  get separator(): string {
    return this.native.currency in currencies ? currencies[this.native.currency].separator : ''
  }

  // returns amount in major units (no truncation)
  get amount(): number {
    return Math.abs(this.native.amount) / this.scale
  }

  // returns truncated amount in major units
  get normalize(): string {
    return this.amount.toFixed(2)
  }

  // returns amount split into major and minor units
  get split(): string[] {
    return String(this.normalize).split('.')
  }

  // returns major unit
  get major(): string {
    return this.split[0]
  }

  // returns minor unit
  get minor(): string {
    return this.split[1]
  }

  // return number of minor units in major
  get scale(): number {
    return 100
  }

  // returns html formatted string
  public html(showCurrency = true, signMode = 1): string {
    let str = '<span class="major">%j</span>'
    str += '<span class="separator">%p</span>'
    str += '<span class="minor">%n</span>'

    if (showCurrency) str = '<span class="currency">%y</span>' + str

    const signModes = [
      '',
      '<span class="sign">%s</span>',
      '<span class="sign">%+</span>',
      '<span class="sign">%-</span>'
    ]

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
  // %s -> sign
  // %c -> currency
  // %s -> currency symbol
  //
  // %+ -> sign if positive
  // %- -> sign if negative
  //
  // %r -> raw amount
  // %a -> locally formatted amount
  //
  // %j -> major
  // %n -> minor
  // %p -> separator
  public format(formatString: string = '%s%y%j%p%n'): string {
    let str = formatString

    str = str.replace(/%s/g, this.sign)
    str = str.replace(/%c/g, this.native.currency)
    str = str.replace(/%y/g, this.symbol)

    str = str.replace(/%\+/g, this.signIfPositive)
    str = str.replace(/%-/g, this.signIfNegative)

    str = str.replace(/%r/g, String(this.native.amount))
    str = str.replace(/%a/g, String(this.amount))

    str = str.replace(/%j/g, this.major)
    str = str.replace(/%n/g, this.minor)
    str = str.replace(/%p/g, this.separator)

    return str
  }

  public toString(): string {
    return this.format()
  }

  public valueOf(): number {
    return this.native.amount
  }
}
