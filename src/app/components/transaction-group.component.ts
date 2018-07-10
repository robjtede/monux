import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core'

import {
  TransactionGroup,
  getGroupTitle,
  sumGroup
} from '../../lib/monzo/helpers'
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

  collapsed = false
  txsTargetHeight!: string
  txsHeight!: string

  constructor(private ref: ChangeDetectorRef) {}

  get groupTitle(): string {
    return getGroupTitle(this.group)
  }

  get groupSize(): number {
    return this.group.txs.filter(tx => !tx.is.metaAction).length
  }

  get groupTotal() {
    return sumGroup(this.group.txs).html({
      signMode: 'never'
    })
  }

  ngAfterViewInit() {
    const height = this.$groupTxs.nativeElement.getBoundingClientRect().height

    if (height) {
      this.txsTargetHeight = `${height}px`
      this.txsHeight = this.txsTargetHeight
    } else {
      console.error('could not set group height')
    }

    // apply inline height style on initialization
    this.ref.detectChanges()
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
