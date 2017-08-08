import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import Amount from '../../lib/monzo/Amount'

@Component({
  selector: 'm-amount',
  templateUrl: './amount.component.html',
  styleUrls: ['./amount.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AmountComponent {
  @Input() private amount: Amount

  getAmountHtml() {
    return !this.amount.foreign || !this.amount.exchanged
      ? this.amount.html(true, 0)
      : this.amount.exchanged.html(true, 0) + this.amount.html(true, 0)
  }
}
