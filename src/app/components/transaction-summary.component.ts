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
import { Transaction, Amount } from 'monzolib'
import { Observable, of, concat } from 'rxjs'
import { map } from 'rxjs/operators'
import Debug = require('debug')

import { AppState } from '../store'

const debug = Debug('app:component:tx-summary')

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
  @Input() readonly coinJarTx?: Transaction

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

  ngOnInit(): void {
    this.iconObserver.observe(this.$icon.nativeElement)

    this.potName$ = concat(
      of(this.tx.displayName),
      this.store$.select('pots').pipe(
        map(pots => {
          const pot = pots.find(pot => {
            return pot.id === (this.tx.is.pot && this.tx.description)
          })

          if (pot) return pot.name
          else return undefined
        })
      )
    )

    this.potImage$ = concat(
      of(this.tx.icon),
      this.store$.select('pots').pipe(
        map(pots => {
          const pot = pots.find(pot => {
            return pot.id === (this.tx.is.pot && this.tx.description)
          })

          if (pot) return `./assets/monzo-pots-images/${pot.style}.png`
          else return undefined
        })
      )
    )
  }

  get totalAmount(): Amount {
    return this.coinJarTx
      ? this.tx.amount.add(this.coinJarTx.amount)
      : this.tx.amount
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
    debug('selecting', this.tx.id)
    this.select.emit(this.tx.id)
  }

  hideTx(ev: MouseEvent): void {
    ev.stopPropagation()

    debug('hiding', this.tx.id)
    this.hide.emit(this.tx)
  }
}
