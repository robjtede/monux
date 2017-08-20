import {
  Component,
  OnChanges,
  Input,
  ChangeDetectionStrategy,
  SimpleChanges
} from '@angular/core'

import { Transaction } from '../../lib/monzo/Transaction'
import {
  groupTransactions,
  TransactionGroup,
  GroupingStrategy
} from '../../lib/monzo/helpers'

@Component({
  selector: 'm-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TransactionListComponent implements OnChanges {
  @Input() readonly txs: Transaction[]

  private txGroups: TransactionGroup[] = []

  ngOnChanges(changes: SimpleChanges) {
    if (Object.keys(changes).includes('txs')) this.updateTxGroups()
  }

  updateTxGroups(): void {
    this.txGroups = groupTransactions(this.txs, GroupingStrategy.Day)
  }
}
