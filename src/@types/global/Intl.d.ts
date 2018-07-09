declare namespace Intl {
  type NumberPartTypes =
    | 'currency'
    | 'decimal'
    | 'fraction'
    | 'group'
    | 'infinity'
    | 'integer'
    | 'literal'
    | 'minusSign'
    | 'nan'
    | 'plusSign'
    | 'percentSign'

  interface NumberPart {
    type: NumberPartTypes
    value: string
  }

  interface NumberFormat {
    formatToParts(value: number): NumberPart[]
  }
}
