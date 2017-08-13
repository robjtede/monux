import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

import Transaction, { TransactionGroup } from '../../lib/monzo/Transaction'

@Component({
  selector: 'm-transaction-group',
  templateUrl: './transaction-group.component.html',
  styleUrls: ['./transaction-group.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TransactionGroupComponent {
  @Input() private readonly group: TransactionGroup
}
