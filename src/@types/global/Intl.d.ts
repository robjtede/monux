declare namespace Intl {
  interface NumberPartTypes {
    currency: string
    decimal: string
    fraction: string
    group: string
    infinity: string
    integer: string
    literal: string
    minusSign: string
    nan: string
    plusSign: string
    percentSign: string
  }

  interface NumberPart {
    type: keyof NumberPartTypes
    value: string
  }

  interface NumberFormat {
    formatToParts(value: number): NumberPart[]
  }
}
