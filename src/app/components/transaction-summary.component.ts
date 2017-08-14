import {
  Component,
  Input,
  ChangeDetectionStrategy,
  HostListener
} from '@angular/core'
import { NgRedux, dispatch } from '@angular-redux/store'

import { AppState } from '../store'
import { TransactionActions } from '../actions/transaction'

import Transaction from '../../lib/monzo/Transaction'

@Component({
  selector: 'm-transaction-summary',
  templateUrl: './transaction-summary.component.html',
  styleUrls: ['./transaction-summary.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.selected]': 'selected',
    '[class.pending]': 'tx.pending',
    '[class.declined]': 'tx.declined',
    '[attr.data-category]': 'tx.category.raw'
  }
})
export class TransactionSummaryComponent {
  @Input() readonly tx: Transaction

  constructor(
    private readonly redux: NgRedux<AppState>,
    private readonly txActions: TransactionActions
  ) {}

  get showAmount(): boolean {
    return !this.tx.is.metaAction && !this.tx.declined
  }

  get selected(): boolean {
    return this.redux.getState().selectedTransaction === this.tx.id
  }

  @HostListener('click')
  @dispatch()
  selectTx() {
    return this.txActions.selectTransaction(this.tx.id)
  }
}
