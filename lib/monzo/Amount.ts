export interface ICurrency {
  symbol: string
  separator: string
}

export interface ICurrencies {
  [currencyName: string]: ICurrency
}

const currencies: ICurrencies = {
  "EUR": { symbol: "€", separator: "." },
  "GBP": { symbol: "£", separator: "." },
  "USDmo": { symbol: "$", separator: "." },
}

export interface IAmountOptions {
  raw: number
  currency: string
  localRaw?: number | null
  localCurrency?: string | null
  exchanged?: boolean
}

export default class Amount {
  private raw: number
  private currency: string
  private localRaw?: number | null
  private localCurrency?: string | null
  private exchanged?: boolean

  constructor({ raw, currency, localRaw = null, localCurrency = null, exchanged = false }: IAmountOptions) {
    this.raw = Number(raw)
    this.currency = String(currency).toUpperCase()

    this.localRaw = localRaw === null ? null : Number(localRaw)
    this.localCurrency = localCurrency === null ? null : localCurrency.toUpperCase()

    this.exchanged = exchanged
  }

  // returns true if not home currency
  get foreign(): boolean {
    return !this.localRaw && !this.localCurrency
  }

  // returns local currency amount object
  get local() {
    if (!this.foreign) return null

    return new Amount({
      raw: this.localRaw,
      currency: this.localCurrency,
      exchanged: true,
    } as IAmountOptions)
  }

  // returns true if negative amount
  get negative() {
    return this.raw <= 0
  }

  // returns true if positive amount
  get positive() {
    return !this.negative
  }

  // returns sign
  get sign() {
    return this.negative ? "-" : "+"
  }

  // returns sign only when positive
  get signIfPositive() {
    return this.positive ? "+" : ""
  }

  // returns sign only when negative
  get signIfNegative() {
    return this.negative ? "-" : ""
  }

  // returns currency symbol
  get symbol() {
    return this.currency in currencies ? currencies[this.currency].symbol : ""
  }

  // return currency separator
  get separator() {
    return this.currency in currencies ? currencies[this.currency].separator : ""
  }

  // returns amount in major units (no truncation)
  get amount() {
    return Math.abs(this.raw) / this.scale
  }

  // returns truncated amount in major units
  get normalize() {
    return this.amount.toFixed(2)
  }

  // returns amount split into major and minor units
  get split() {
    return String(this.normalize).split(".")
  }

  // returns major unit
  get major() {
    return this.split[0]
  }

  // returns minor unit
  get minor() {
    return this.split[1]
  }

  // return number of minor units in major
  get scale() {
    return 100
  }

  // returns html formatted string
  html(showCurrency = true, signMode = 1) {
    let str = '<span class="major">%j</span>'
    str += '<span class="separator">%p</span>'
    str += '<span class="minor">%n</span>'

    if (showCurrency) str = '<span class="currency">%y</span>' + str

    const signModes = [
      "",
      '<span class="sign">%s</span>',
      '<span class="sign">%+</span>',
      '<span class="sign">%-</span>',
    ]

    str = signModes[signMode] + str
    str = this.format(str)

    const el = document.createElement("span")
    el.classList.add("amount")
    el.classList.add(this.positive ? "positive" : "negative")
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
  format(formatString: string = "%s%y%j%p%n"): string {
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

  toString(): string {
    return this.format()
  }

  valueOf(): number {
    return this.raw
  }
}
