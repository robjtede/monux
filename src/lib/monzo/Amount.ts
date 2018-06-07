export const enum Currencies {
  EUR = 'EUR',
  GBP = 'GBP',
  USD = 'USD'
}

export const enum SignModes {
  Always,
  OnlyPositive,
  OnlyNegative,
  Never
}

const currencies: CurrencyLibrary = {
  [Currencies.EUR]: { symbol: '€', separator: '.' },
  [Currencies.GBP]: { symbol: '£', separator: '.' },
  [Currencies.USD]: { symbol: '$', separator: '.' }
}

export class Amount {
  private readonly native: SimpleAmount
  private readonly local?: SimpleAmount

  constructor({ native, local }: AmountOpts) {
    this.native = native
    this.local = local
  }

  // returns true if not home currency
  get foreign(): boolean {
    return !!this.local
  }

  // returns local currency as native currency
  get exchanged(): Amount | undefined {
    if (this.local) return new Amount({ native: this.local })
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
  get currency(): string {
    return this.native.currency
  }

  // returns currency symbol
  get symbol(): string {
    return this.native.currency in currencies
      ? currencies[this.native.currency].symbol
      : ''
  }

  // return currency separator
  get separator(): string {
    return this.native.currency in currencies
      ? currencies[this.native.currency].separator
      : ''
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

  // returns raw amount from api
  get raw(): number {
    return this.native.amount
  }

  // returns html formatted string
  html({
    showCurrency = true,
    signMode = SignModes.Always
  }: { showCurrency?: boolean; signMode?: SignModes } = {}): string {
    let str = '<span class="major">%j</span>'
    str += '<span class="separator">%p</span>'
    str += '<span class="minor">%n</span>'

    if (showCurrency) str = '<span class="currency">%y</span>' + str

    const signModes = {
      [SignModes.Always]: '<span class="sign">%s</span>',
      [SignModes.OnlyPositive]: '<span class="sign">%+</span>',
      [SignModes.OnlyNegative]: '<span class="sign">%-</span>',
      [SignModes.Never]: ''
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
  format(formatString: string = '%s%y%j%p%n'): string {
    let str = formatString

    str = str.replace(/%s/g, this.sign)
    str = str.replace(/%c/g, this.native.currency)
    str = str.replace(/%y/g, this.symbol)

    str = str.replace(/%\+/g, this.signIfPositive)
    str = str.replace(/%-/g, this.signIfNegative)

    str = str.replace(/%r/g, String(this.raw))
    str = str.replace(/%a/g, String(this.amount))
    str = str.replace(/%m/g, String(this.normalize))

    str = str.replace(/%j/g, this.major)
    str = str.replace(/%n/g, this.minor)
    str = str.replace(/%p/g, this.separator)

    return str
  }

  get json(): AmountOpts {
    return {
      native: this.native,
      local: this.local
    }
  }

  get stringify(): string {
    return JSON.stringify(this.json)
  }

  toString(): string {
    return this.format()
  }

  valueOf(): number {
    return this.native.amount
  }
}

export interface CurrencyDefinition {
  symbol: string
  separator: string
}

export interface CurrencyLibrary {
  [currency: string]: CurrencyDefinition
}

export interface SimpleAmount {
  amount: number
  currency: string
}

export interface AmountOpts {
  native: SimpleAmount
  local?: SimpleAmount
}

export interface MonzoBalanceResponse {
  balance: number
  total_balance: number
  // TODO: currency enum-ify
  currency: string
  // TODO: currency enum-ify
  local_currency: string
  local_exchange_rate: number
  local_spend: {
    [currency: string]: number
  }[]
  spend_today: number
}
