import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

import { Amount, SignModes } from '../../lib/monzo/Amount'

@Component({
  selector: 'm-amount',
  templateUrl: './amount.component.html',
  styleUrls: ['./amount.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.positive]': 'amount.positive',
    '[class.negative]': 'amount.negative'
  }
})
export class AmountComponent {
  @Input() amount!: Amount

  // formatting parameters
  @Input() show: ShowModes = 'both'
  @Input('sign-mode') signMode?: SignModes = 'always'
  @Input('currency-mode') currencyMode?: CurrencyModes = 'both'
  @Input('large-major') largeMajor?: boolean = false

  get domesticParts(): Intl.NumberPart[] {
    const showCurrency =
      this.currencyMode === 'both' || this.currencyMode === 'domestic'

    return this.amount.formatParts({
      showCurrency: showCurrency,
      signMode: this.signMode
    })
  }

  get localParts(): Intl.NumberPart[] | undefined {
    if (!this.amount.exchanged) return

    return this.amount.exchanged.formatParts({
      showCurrency: true,
      signMode: this.signMode
    })
  }

  // TODO: rename to primary/secondary
  get showDomestic() {
    return this.show === 'both' || this.show === 'domestic'
  }

  get showLocal() {
    return (
      this.amount.foreign && (this.show === 'both' || this.show === 'local')
    )
  }
}

export type ShowModes = 'both' | 'local' | 'domestic' | 'neither'
export type CurrencyModes = 'both' | 'local' | 'domestic' | 'neither'
