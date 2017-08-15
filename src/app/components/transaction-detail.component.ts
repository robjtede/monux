import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
// import { NgRedux, dispatch } from '@angular-redux/store'
import { format } from 'date-fns'

// import { AppState } from '../store'
// import { TransactionActions } from '../actions/transaction'

import Transaction from '../../lib/monzo/Transaction'

@Component({
  selector: 'm-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.declined]': 'tx.declined',
    '[attr.data-category]': 'tx.category'
  }
})
export class TransactionDetailComponent {
  @Input() readonly tx: Transaction

  constructor() // private readonly redux: NgRedux<AppState>,
  // private readonly txActions: TransactionActions
  {
  }

  get createdTime() {
    return format(this.tx.created, 'h:mma - Do MMMM YYYY')
  }

  get emoji() {
    if (typeof this.tx.merchant === 'string' || !this.tx.merchant.emoji) {
      return '💵️'
    } else {
      return this.tx.merchant.emoji
    }
  }

  get noted() {
    return !!this.tx.notes
  }
}
