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
import { Store } from '@ngrx/store'
import { Transaction } from 'monzolib'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'

import { AppState } from '../store'

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

  potName$!: Observable<string | undefined>
  potImage$!: Observable<string | undefined>

  private iconObserver = new IntersectionObserver(
    this.onIconIntersection.bind(this),
    {
      root: null,
      rootMargin: '500px',
      threshold: 0.001
    }
  )

  constructor(private store$: Store<AppState>) {}

  ngOnInit() {
    this.iconObserver.observe(this.$icon.nativeElement)

    this.potName$ = this.store$.select('pots').pipe(
      map(pots => {
        const pot = pots.find(pot => {
          return pot.id === (this.tx.is.pot && this.tx.description)
        })

        if (pot) return pot.name
        else return undefined
      })
    )

    this.potImage$ = this.store$.select('pots').pipe(
      map(pots => {
        const pot = pots.find(pot => {
          return pot.id === (this.tx.is.pot && this.tx.description)
        })

        if (pot) return `./assets/monzo-pots-images/${pot.style}.png`
        else return undefined
      })
    )
  }

  get icon$(): Observable<string> {
    if (this.tx.is.pot) {
      return this.potImage$ as Observable<string>
    } else {
      return of(this.tx.icon)
    }
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
