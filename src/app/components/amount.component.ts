import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import Amount, { SignModes } from '../../lib/monzo/Amount'

@Component({
  selector: 'm-amount',
  templateUrl: './amount.component.html',
  styleUrls: ['./amount.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmountComponent {
  @Input() readonly amount: Amount

  getAmountHtml() {
    return !this.amount.foreign
      ? this.amount.html({
          signMode: SignModes.Never
        })
      : (this.amount.exchanged as Amount).html({ signMode: SignModes.Never }) +
        this.amount.html({
          signMode: SignModes.Never
        })
  }
}
