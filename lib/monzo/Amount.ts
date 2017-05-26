export interface ICurrency {
  symbol: string
  separator: string
}

export interface ICurrencies {
  [currencyName: string]: ICurrency
}

const currencies: ICurrencies = {
  EUR: { symbol: '€', separator: '.' },
  GBP: { symbol: '£', separator: '.' },
  USD: { symbol: '$', separator: '.' }
}

export interface IAmountOptions {
  raw: number
  currency: string
  localRaw?: number | undefined
  localCurrency?: string | undefined
  exchanged?: boolean
}

export default class Amount {
  private raw: number
  private currency: string
  private localRaw?: number | undefined
  private localCurrency?: string | undefined
  private exchanged?: boolean

  constructor({ raw, currency, localRaw, localCurrency, exchanged = false }: IAmountOptions) {
    this.raw = Number(raw)
    this.currency = String(currency).toUpperCase()

    this.localRaw = localRaw ? Number(localRaw) : undefined
    this.localCurrency = localCurrency ? localCurrency.toUpperCase() : undefined

    this.exchanged = exchanged
  }

  // returns true if not home currency
  get foreign(): boolean {
    return !!this.localRaw && !!this.localCurrency
  }

  // returns local currency amount object
  get local(): Amount | undefined {
    if (!this.foreign) return

    return new Amount({
      raw: this.localRaw,
      currency: this.localCurrency,
      exchanged: true
    } as IAmountOptions)
  }

  // returns true if negative amount
  get negative(): boolean {
    return this.raw <= 0
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
    return this.currency in currencies ? currencies[this.currency].symbol : ''
  }

  // return currency separator
  get separator(): string {
    return this.currency in currencies ? currencies[this.currency].separator : ''
  }

  // returns amount in major units (no truncation)
  get amount(): number {
    return Math.abs(this.raw) / this.scale
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
    str = str.replace(/%c/g, this.currency)
    str = str.replace(/%y/g, this.symbol)

    str = str.replace(/%\+/g, this.signIfPositive)
    str = str.replace(/%-/g, this.signIfNegative)

    str = str.replace(/%r/g, String(this.raw))
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
    return this.raw
  }
}
