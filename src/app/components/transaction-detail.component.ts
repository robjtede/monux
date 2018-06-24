import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild
} from '@angular/core'
import { Store } from '@ngrx/store'
import { format } from 'date-fns'
import Debug = require('debug')

import { Transaction } from '../../lib/monzo/Transaction'

import { AppState } from '../store'
import {
  PatchTransactionNotesAction,
  UploadAttachmentAction
} from '../store/actions/transactions.actions'
import { Attachment } from '../../lib/monzo/Attachment'
import { DeregisterAttachmentAction } from '../store/actions/attachment.actions'

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
export class TransactionDetailComponent {
  @Input() readonly tx!: Transaction

  @ViewChild('icon') readonly $icon!: ElementRef<HTMLImageElement>
  @ViewChild('uploader') readonly $uploader!: ElementRef<HTMLInputElement>

  constructor(private store$: Store<AppState>) {}

  // TEMP
  ngAfterContentChecked() {
    debug('content checked')
  }

  // TEMP
  ngAfterViewChecked() {
    debug('view checked')
  }

  get createdTime(): string {
    return format(this.tx.created, 'h:mma - Do MMMM YYYY')
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

  uploadAttachment(ev: Event): void {
    ev.preventDefault()

    const file = (this.$uploader.nativeElement.files as FileList)[0]
    debug(file)

    this.store$.dispatch(new UploadAttachmentAction(this.tx, file))
  }

  deregisterAttachment(attachment: Attachment): void {
    this.store$.dispatch(new DeregisterAttachmentAction(attachment))
  }
}
