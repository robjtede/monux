import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core'
import {
  getGroupTitle,
  sumGroup,
  Transaction,
  TransactionGroup
} from 'monzolib'

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
  txsTransform!: string
  txsOpacity!: number

  constructor(private ref: ChangeDetectorRef) {}

  get groupTitle(): string {
    return getGroupTitle(this.group)
  }

  get visibleTxs(): Transaction[] {
    return this.group.txs.filter(tx => !tx.is.auto_coin_jar)
  }

  get groupTotal() {
    return sumGroup(this.group.txs)
  }

  coinJarTxFor(tx: Transaction): Transaction | undefined {
    if (!tx.is.rounded) {
      return undefined
    } else {
      return this.group.txs.find(
        otherTx => otherTx.id === tx.metadata.coin_jar_transaction
      )
    }
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
      this.txsTransform = 'rotateX(0)'
      this.txsOpacity = 1
    } else {
      this.txsHeight = '0px'
      this.txsTransform = 'rotateX(90deg)'
      this.txsOpacity = 0
    }

    this.collapsed = !this.collapsed
  }

  selectTx(txId: string): void {
    this.select.emit(txId)
  }
}
