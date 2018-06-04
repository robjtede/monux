import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  HostListener,
  ViewChild,
  ElementRef
} from '@angular/core'
import { filter, map } from 'rxjs/operators'
import { Store } from '@ngrx/store'
import { NgRedux, dispatch } from '@angular-redux/store'

import { AppState } from '../store'
import { SelectTransactionAction } from '../store/actions/selectedTransaction.actions'
import { AppState as OldAppState } from '../state'
import { TransactionActions } from '../actions/transaction'

import { Transaction } from '../../lib/monzo/Transaction'

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

  selected = false

  iconObserver = new IntersectionObserver(this.onIconIntersection.bind(this), {
    rootMargin: '50px 0px',
    threshold: 0.01,
    root: document.documentElement
  })

  constructor(
    private readonly redux: NgRedux<OldAppState>,
    private readonly store: Store<AppState>,
    private readonly txActions: TransactionActions
  ) {}

  ngOnInit() {
    this.iconObserver.observe(this.$icon.nativeElement)

    this.store
      .select('selectedTransaction')
      .pipe(
        filter(x => !!x),
        map(x => x === this.tx.id)
      )
      .subscribe(x => (this.selected = x))
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
      this.$icon.nativeElement.src = this.$icon.nativeElement.dataset.src

      this.iconObserver.unobserve(this.$icon.nativeElement)
    }
  }

  @HostListener('click')
  selectTx() {
    this.store.dispatch(new SelectTransactionAction(this.tx.id))
    this.redux.dispatch(this.txActions.getTransaction(this.tx.id))
  }

  @dispatch()
  hideTx(ev: MouseEvent) {
    ev.stopPropagation()

    return this.txActions.hideTransaction(this.tx)
  }
}
