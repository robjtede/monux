import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

import Transaction from '../../lib/monzo/Transaction'

@Component({
  selector: 'm-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionListComponent {
  @Input() private readonly txs: Transaction

  constructor() {}
}
