import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { Transaction } from 'monzolib'

@Component({
  selector: 'm-transaction-summary',
  templateUrl: './transaction-summary.component.html',
  styleUrls: ['./transaction-summary.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.declined]': 'tx.declined',
    '[attr.data-category]': 'tx.category.raw'
  }
})
export class TransactionSummaryComponent implements OnInit {
  @Input() readonly tx!: Transaction

  @Input()
  @HostBinding('class.selected')
  readonly selected!: boolean

  @Output() select = new EventEmitter<string>()
  @Output() hide = new EventEmitter<Transaction>()

  @ViewChild('icon') readonly $icon!: ElementRef<HTMLImageElement>

  private iconObserver = new IntersectionObserver(
    this.onIconIntersection.bind(this),
    {
      root: null,
      rootMargin: '500px',
      threshold: 0.001
    }
  )

  ngOnInit() {
    this.iconObserver.observe(this.$icon.nativeElement)
  }

  get showAmount(): boolean {
    return !this.tx.is.metaAction && !this.tx.declined
  }

  get hasAttachments() {
    return this.tx.attachments && this.tx.attachments.length
  }

  iconFallback() {
    this.$icon.nativeElement.src = this.tx.iconFallback
  }

  onIconIntersection(entries: IntersectionObserverEntry[]) {
    if (entries.length && entries[0].intersectionRatio > 0) {
      this.$icon.nativeElement.src = this.$icon.nativeElement.dataset
        .src as string

      this.iconObserver.unobserve(this.$icon.nativeElement)
    }
  }

  @HostListener('click')
  selectTx(): void {
    this.select.emit(this.tx.id)
  }

  hideTx(ev: MouseEvent): void {
    ev.stopPropagation()
    this.hide.emit(this.tx)
  }
}
