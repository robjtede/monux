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
import { Merchant } from '../../lib/monzo/Merchant'

@Component({
  selector: 'm-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionListComponent implements OnChanges {
  @Input() readonly txs!: Transaction[]

  search?: string
  txGroups: TransactionGroup[] = []

  ngOnChanges(changes: SimpleChanges) {
    if (Object.keys(changes).includes('txs')) this.updateTxGroups()
  }

  updateTxGroups(): void {
    if (this.search) {
      this.txGroups = groupTransactions(
        this.txs.filter(tx => {
          const re = new RegExp(`.*${this.search}.*`, 'i')

          return (
            re.test(tx.displayName) ||
            re.test(tx.category.raw) ||
            re.test(tx.notes.full) ||
            (tx.merchant && typeof tx.merchant === 'string'
              ? re.test(tx.merchant)
              : false) ||
            (tx.merchant && tx.merchant instanceof Merchant
              ? re.test(tx.merchant.name)
              : false)
          )
        }),
        GroupingStrategy.Day
      )
    } else {
      this.txGroups = groupTransactions(this.txs, GroupingStrategy.Day)
    }
  }

  updateSearch(search: string): void {
    this.search = search.trim() ? search : undefined
    this.updateTxGroups()
  }
}
