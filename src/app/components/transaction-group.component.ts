import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core'

import {
  TransactionGroup,
  getGroupTitle,
  sumGroup
} from '../../lib/monzo/helpers'
import { SignModes } from '../../lib/monzo/Amount'
import { Transaction } from '../../lib/monzo/Transaction'

@Component({
  selector: 'm-transaction-group',
  templateUrl: './transaction-group.component.html',
  styleUrls: ['./transaction-group.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionGroupComponent {
  @Input() readonly group!: TransactionGroup
  @Input() readonly selectedTx?: Transaction

  @Output() select = new EventEmitter<string>()

  get groupTitle(): string {
    return getGroupTitle(this.group)
  }

  get groupSize(): number {
    return this.group.txs.filter(tx => !tx.is.metaAction).length
  }

  get groupTotal() {
    return sumGroup(this.group.txs).html({
      signMode: SignModes.Never
    })
  }

  selectTx(txId: string): void {
    this.select.emit(txId)
  }
}
