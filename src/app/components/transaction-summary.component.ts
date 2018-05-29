import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  HostListener,
  ViewChild,
  ElementRef
} from '@angular/core'
import { NgRedux, dispatch } from '@angular-redux/store'

import { AppState } from '../store'
import { TransactionActions } from '../actions/transaction'

import { Transaction } from '../../lib/monzo/Transaction'
import { SignModes } from '../../lib/monzo/Amount'

@Component({
  selector: 'm-transaction-summary',
  templateUrl: './transaction-summary.component.html',
  styleUrls: ['./transaction-summary.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.selected]': 'selected',
    '[class.declined]': 'tx.declined',
    '[attr.data-category]': 'tx.category.raw'
  }
})
export class TransactionSummaryComponent implements OnInit {
  @Input() readonly tx!: Transaction

  @ViewChild('icon') readonly $icon!: ElementRef

  iconObserver = new IntersectionObserver(this.onIconIntersection.bind(this), {
    rootMargin: '50px 0px',
    threshold: 0.01,
    root: document.documentElement
  })

  constructor(
    private readonly redux: NgRedux<AppState>,
    private readonly txActions: TransactionActions
  ) {}

  ngOnInit() {
    this.iconObserver.observe(this.$icon.nativeElement)
  }

  get showAmount(): boolean {
    return !this.tx.is.metaAction && !this.tx.declined
  }

  get selected(): boolean {
    return this.redux.getState().selectedTransaction === this.tx.id
  }

  get hasAttachments() {
    return this.tx.attachments && this.tx.attachments.length
  }

  iconFallback() {
    this.$icon.nativeElement.src = this.tx.iconFallback
  }

  onIconIntersection(entries: IntersectionObserverEntry[]) {
    if (entries.length && entries[0].intersectionRatio > 0) {
      this.$icon.nativeElement.src = this.$icon.nativeElement.dataset.src

      this.iconObserver.unobserve(this.$icon.nativeElement)
    }
  }

  @HostListener('click')
  selectTx() {
    this.redux.dispatch(this.txActions.selectTransaction(this.tx.id))
    this.redux.dispatch(this.txActions.getTransaction(this.tx.id))
  }

  @dispatch()
  hideTx(ev: MouseEvent) {
    ev.stopPropagation()

    return this.txActions.hideTransaction(this.tx)
  }
}
