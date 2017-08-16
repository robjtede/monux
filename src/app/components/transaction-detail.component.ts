import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild
} from '@angular/core'
// import { NgRedux, dispatch } from '@angular-redux/store'
import { format } from 'date-fns'

// import { AppState } from '../store'
// import { TransactionActions } from '../actions/transaction'

import Transaction from '../../lib/monzo/Transaction'
import { SignModes } from '../../lib/monzo/Amount'

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

  @ViewChild('icon') readonly $icon: ElementRef

  // private readonly redux: NgRedux<AppState>,
  // private readonly txActions: TransactionActions
  constructor() {}

  get createdTime() {
    return format(this.tx.created, 'h:mma - Do MMMM YYYY')
  }

  get txAmount(): string {
    return this.tx.amount.html({
      signMode: SignModes.Never
    })
  }

  get txBalance(): string {
    return this.tx.balance.html({
      signMode: SignModes.Never
    })
  }

  get emoji() {
    if (
      typeof this.tx.merchant === 'string' ||
      !this.tx.merchant ||
      !this.tx.merchant.emoji
    ) {
      return '💵️'
    } else {
      return this.tx.merchant.emoji
    }
  }

  iconFallback() {
    this.$icon.nativeElement.src = this.tx.iconFallback
  }
}
