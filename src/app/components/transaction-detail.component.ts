import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core'
import { Store } from '@ngrx/store'
import { format } from 'date-fns'
import Debug = require('debug')
import {
  Attachment,
  Transaction,
  MonzoTransactionResponse,
  MonzoPotResponse
} from 'monzolib'
import { Observable, of, BehaviorSubject, combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'

import { ModalService } from '../services/modal.service'
import { AppState } from '../store'
import { DeregisterAttachmentAction } from '../store/actions/attachment.actions'
import {
  PatchTransactionNotesAction,
  UploadAttachmentAction
} from '../store/actions/transactions.actions'
import { CategoryDialogComponent } from './category-dialog.component'
import { AttachmentLightboxComponent } from './attachment-lightbox.component'

const debug = Debug('app:component:tx-detail')

@Component({
  selector: 'm-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.declined]': 'tx.declined',
    '[attr.data-category]': 'tx.category'
  }
})
export class TransactionDetailComponent implements OnInit {
  private tx$: BehaviorSubject<Transaction> = new BehaviorSubject<Transaction>(
    // Somehow this is type-safe...
    new Transaction({} as MonzoTransactionResponse)
  )

  @Input()
  set tx(tx: Transaction) {
    this.tx$.next(tx)
  }
  get tx(): Transaction {
    return this.tx$.getValue()
  }

  @ViewChild('icon') readonly $icon!: ElementRef<HTMLImageElement>
  @ViewChild('uploader') readonly $uploader!: ElementRef<HTMLInputElement>

  pot$!: Observable<MonzoPotResponse | undefined>
  potName$!: Observable<string | undefined>
  potImage$!: Observable<string | undefined>

  constructor(private store$: Store<AppState>, private modal: ModalService) {}

  ngOnInit(): void {
    this.pot$ = combineLatest(this.store$.select('pots'), this.tx$).pipe(
      map(([pots, tx]) => {
        return pots.find(pot => {
          return pot.id === (tx.is.pot && tx.description)
        })
      })
    )

    this.potName$ = this.pot$.pipe(
      map(pot => {
        if (pot) return pot.name
        else return undefined
      })
    )

    this.potImage$ = this.pot$.pipe(
      map(pot => {
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

  get createdTime(): string {
    return format(this.tx.created, 'h:mma - do MMMM YYYY')
  }

  get emoji(): string {
    if (
      typeof this.tx.merchant === 'string' ||
      !this.tx.merchant ||
      !this.tx.merchant.emoji
    ) {
      return '💵️'
    } else {
      return this.tx.merchant.emoji
    }
  }

  get hasAttachments(): boolean {
    return !!(this.tx.attachments && this.tx.attachments.length)
  }

  get showAmount(): boolean {
    return !this.tx.is.metaAction && !this.tx.declined
  }

  iconFallback(): void {
    this.$icon.nativeElement.src = this.tx.iconFallback
  }

  updateNotes(notes: string): void {
    this.store$.dispatch(new PatchTransactionNotesAction(this.tx, notes))
  }

  openCategoryModal(ev?: MouseEvent): void {
    if (ev) {
      ev.stopPropagation()
      ev.preventDefault()
    }

    this.modal.open(CategoryDialogComponent, {
      tx: this.tx
    })
  }

  uploadAttachment(ev: Event): void {
    ev.preventDefault()

    const file = (this.$uploader.nativeElement.files as FileList)[0]
    debug(file)

    this.store$.dispatch(new UploadAttachmentAction(this.tx, file))

    this.$uploader.nativeElement.value = ''
  }

  enlargeAttachment(attachment: Attachment): void {
    this.modal.open(AttachmentLightboxComponent, {
      attachment
    })
  }

  deregisterAttachment(attachment: Attachment): void {
    this.store$.dispatch(new DeregisterAttachmentAction(attachment))
  }
}
