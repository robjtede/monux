import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import Amount from '../../lib/monzo/Amount'

@Component({
  selector: 'm-amount',
  templateUrl: './amount.component.html',
  styleUrls: ['./amount.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmountComponent {
  @Input() private readonly amount: Amount

  getAmountHtml() {
    return !this.amount.foreign
      ? this.amount.html(true, 0)
      : (this.amount.exchanged as Amount).html(true, 0) +
        this.amount.html(true, 0)
  }
}
