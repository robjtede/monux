import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

import Transaction from '../../lib/monzo/Transaction'

@Component({
  selector: 'm-transaction-summary',
  templateUrl: './transaction-summary.component.html',
  styleUrls: ['./transaction-summary.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    '[attr.data-category]': 'tx.category.raw',
    '[class.pending]': 'tx.pending',
    '[class.declined]': 'tx.declined'
  }
})
export class TransactionSummaryComponent {
  @Input() private readonly tx: Transaction

  constructor() {}

  get showAmount() {
    return !this.tx.is.metaAction && !this.tx.declined
  }
}
