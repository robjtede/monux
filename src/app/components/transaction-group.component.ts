import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit
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
export class TransactionGroupComponent implements AfterViewInit {
  @Input() readonly group!: TransactionGroup
  @Input() readonly selectedTx?: Transaction

  @Output() select = new EventEmitter<string>()

  @ViewChild('groupTxs') $groupTxs!: ElementRef<HTMLDivElement>

  private collapsed = false
  private txsTargetHeight!: string
  txsHeight!: string

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

  ngAfterViewInit() {
    const height = window.getComputedStyle(this.$groupTxs.nativeElement).height

    if (height) {
      this.txsTargetHeight = height
      this.txsHeight = this.txsTargetHeight
    } else {
      console.error('could not set group height')
    }
  }

  toggleCollapse(): void {
    if (this.collapsed) {
      this.txsHeight = this.txsTargetHeight
    } else {
      this.txsHeight = '0px'
    }

    this.collapsed = !this.collapsed
  }

  selectTx(txId: string): void {
    this.select.emit(txId)
  }
}
