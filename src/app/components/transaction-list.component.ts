import {
  Component,
  OnChanges,
  Input,
  ChangeDetectionStrategy,
  SimpleChanges
} from '@angular/core'

import Transaction, {
  TransactionGroup,
  groupTransactions
} from '../../lib/monzo/Transaction'

@Component({
  selector: 'm-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionListComponent implements OnChanges {
  @Input() private readonly txs: Transaction[]

  private txGroups: TransactionGroup[] = []

  constructor() {}

  updateTxGroups(): void {
    this.txGroups = groupTransactions(this.txs, 'day')
  }

  ngOnChanges(changes: SimpleChanges) {
    if (Object.keys(changes).includes('txs')) this.updateTxGroups()
  }
}
