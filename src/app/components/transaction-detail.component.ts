import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild
} from '@angular/core'
import { Store } from '@ngrx/store'
import { format } from 'date-fns'

import { SignModes } from '../../lib/monzo/Amount'
import { Transaction } from '../../lib/monzo/Transaction'

import { AppState } from '../store'
import {
  PatchTransactionNotesAction,
  UploadAttachmentAction
} from '../store/actions/transactions.actions'

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

  @ViewChild('icon') readonly $icon!: ElementRef
  @ViewChild('uploader') readonly $uploader!: ElementRef

  constructor(private store$: Store<AppState>) {}

  // TEMP
  ngAfterContentChecked() {
    console.log('content checked')
  }

  // TEMP
  ngAfterViewChecked() {
    console.log('view checked')
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

  uploadAttachment(ev: Event): void {
    ev.preventDefault()

    const file: File = this.$uploader.nativeElement.files[0]
    console.log(file)

    this.store$.dispatch(new UploadAttachmentAction(this.tx, file))
  }

  updateNotes(notes: string): void {
    this.store$.dispatch(new PatchTransactionNotesAction(this.tx.json, notes))
  }
}
