import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

import {
  TransactionGroup,
  getGroupTitle,
  sumGroup
} from '../../lib/monzo/helpers'
import Amount, { SignModes } from '../../lib/monzo/Amount'

@Component({
  selector: 'm-transaction-group',
  templateUrl: './transaction-group.component.html',
  styleUrls: ['./transaction-group.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TransactionGroupComponent {
  @Input() readonly group: TransactionGroup

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
}
