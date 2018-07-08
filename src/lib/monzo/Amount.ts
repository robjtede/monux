export type Currencies = 'EUR' | 'GBP' | 'USD' | 'ISK'

export const enum SignModes {
  Always,
  OnlyPositive,
  OnlyNegative,
  Never
}

const currencies: CurrencyLibrary = {
  EUR: { symbol: '€', separator: '.', subunits: 100 },
  GBP: { symbol: '£', separator: '.', subunits: 100 },
  USD: { symbol: '$', separator: '.', subunits: 100 },
  ISK: { symbol: 'ISK_', separator: '_', subunits: 1 }
}

export class Amount {
  private readonly domestic: SimpleAmount
  private readonly local?: SimpleAmount
  private readonly formatter: Intl.NumberFormat

  constructor({ domestic, local }: AmountOpts) {
    this.domestic = domestic
    this.local = local

    const language = (navigator && navigator.language) || 'en-GB'
    this.formatter = Intl.NumberFormat(language, {
      style: 'currency',
      currency: (this.local && this.local.currency) || this.domestic.currency
    })
  }

  // returns true if not home currency
  get foreign(): boolean {
    return !!this.local
  }

  // returns local currency as native currency
  get exchanged(): Amount | undefined {
    if (this.local) return new Amount({ domestic: this.local })
    else return
  }

  // returns true if negative amount
  get negative(): boolean {
    return this.domestic.amount <= 0
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
    return this.domestic.currency
  }

  // returns currency symbol
  get symbol(): string {
    return this.domestic.currency in currencies
      ? currencies[this.domestic.currency].symbol
      : this.domestic.currency
  }

  // return currency separator
  get separator(): string {
    return this.domestic.currency in currencies
      ? currencies[this.domestic.currency].separator
      : ''
  }

  // returns amount in major units (no truncation)
  get amount(): number {
    return Math.abs(this.domestic.amount) / this.scale
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
    return this.domestic.currency in currencies
      ? currencies[this.domestic.currency].subunits
      : 1
  }

  // returns raw amount from api
  get raw(): number {
    return this.domestic.amount
  }

  // returns html formatted string
  html({
    showCurrency = true,
    signMode = SignModes.Always
  }: { showCurrency?: boolean; signMode?: SignModes } = {}): string {
    type NumberPartTransformationFunction = (value: string) => string

    const strfpart: {
      [T in keyof Intl.NumberPartTypes]?: NumberPartTransformationFunction
    } = {
      currency: val => {
        return showCurrency ? val : ''
      },
      minusSign: val => {
        if (
          signMode === SignModes.Always ||
          signMode === SignModes.OnlyNegative
        ) {
          return val
        } else {
          return ''
        }
      },
      plusSign: val => {
        if (
          signMode === SignModes.Always ||
          signMode === SignModes.OnlyPositive
        ) {
          return val
        } else {
          return ''
        }
      }
    }

    const str = this.formatter
      .formatToParts(this.domestic.amount)
      .map(
        ({ type, value }) =>
          type in strfpart
            ? {
                type,
                value: (strfpart[type] as NumberPartTransformationFunction)(
                  value
                )
              }
            : { type, value }
      )
      .map(({ type, value }) => `<span class="amount__${type}">${value}</span>`)
      .reduce((str, part) => str + part)

    // construct wrapper
    const el = document.createElement('span')
    el.classList.add('amount')
    el.dataset.positive = this.positive ? 'positive' : 'negative'
    el.dataset.currency = this.currency
    el.innerHTML = str

    return el.outerHTML
  }

  format(): string {
    return this.formatter.format(this.domestic.amount)
  }

  get json(): AmountOpts {
    return {
      domestic: this.domestic,
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
    return this.domestic.amount
  }
}

export interface CurrencyDefinition {
  symbol: string
  separator: string
  subunits: number
}

export interface CurrencyLibrary {
  [currency: string]: CurrencyDefinition
}

export interface SimpleAmount {
  amount: number
  currency: string
}

export interface AmountOpts {
  domestic: SimpleAmount
  local?: SimpleAmount
}

export interface MonzoBalanceResponse {
  balance: number
  total_balance: number
  currency: Currencies
  local_currency: Currencies
  local_exchange_rate: number
  local_spend: {
    spend_today: number
    currency: Currencies
  }[]
  spend_today: number
}
