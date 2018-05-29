import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { Amount } from '../../lib/monzo/Amount'

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
  @Input() readonly amount!: Amount
  @Input() readonly show?: ShowModes = 'both'
  @Input('sign-mode') readonly signMode?: SignModes = 'always'
  @Input('currency-mode') readonly currencyMode?: CurrencyModes = 'both'
  @Input('large-major') readonly largeMajor?: boolean = false

  get showNative() {
    return this.show === 'both' || this.show === 'native'
  }

  get showLocal() {
    return (
      this.amount.foreign && (this.show === 'both' || this.show === 'local')
    )
  }
}

export type SignModes = 'always' | 'onlyPositive' | 'onlyNegative' | 'never'
export type ShowModes = 'both' | 'local' | 'native' | 'neither'
export type CurrencyModes = 'both' | 'local' | 'native' | 'neither'
