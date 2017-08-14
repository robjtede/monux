import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

import { TransactionGroup, getGroupTitle } from '../../lib/monzo/helpers'

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
}
