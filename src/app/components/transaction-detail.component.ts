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
    '[attr.data-category]': 'tx.category'
  }
})
export class TransactionDetailComponent {
  @Input() readonly tx: Transaction

  constructor() // private readonly redux: NgRedux<AppState>,
  // private readonly txActions: TransactionActions
  {
  }

  get showAmount(): boolean {
    return !this.tx.is.metaAction && !this.tx.declined
  }

  get createdTime() {
    return format(this.tx.created, 'h:mma - Do MMMM YYYY')
  }
}
