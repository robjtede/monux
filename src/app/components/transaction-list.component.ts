import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core'
import {
  GroupingStrategy,
  groupTransactions,
  Merchant,
  Transaction,
  TransactionGroup
} from 'monzolib'

@Component({
  selector: 'm-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionListComponent implements OnChanges {
  @Input() readonly txs!: Transaction[]
  @Input() readonly selectedTx?: Transaction

  @Output() select = new EventEmitter<string>()
  @Output() loadNextPage = new EventEmitter<Date>()

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

  selectTx(txId: string): void {
    this.select.emit(txId)
  }

  nextPage(ev: MouseEvent): void {
    if (ev) {
      ev.stopPropagation()
      ev.preventDefault()
    }

    this.loadNextPage.emit(this.txs[this.txs.length - 1].created)
  }
}
