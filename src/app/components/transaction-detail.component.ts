import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild
} from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { NgRedux, dispatch } from '@angular-redux/store'
import { format } from 'date-fns'

import { MonzoService } from '../services/monzo.service'

import { AppState } from '../store'
import { TransactionActions } from '../actions/transaction'

import {
  MonzoAttachmentUploadResponse,
  MonzoAttachmentResponse
} from '../../lib/monzo/Attachment'
import Amount, { SignModes } from '../../lib/monzo/Amount'
import Transaction from '../../lib/monzo/Transaction'

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
  @Input() readonly tx: Transaction

  @ViewChild('icon') readonly $icon: ElementRef
  @ViewChild('notes') readonly $notes: ElementRef
  @ViewChild('uploader') readonly $uploader: ElementRef

  constructor(
    private readonly redux: NgRedux<AppState>,
    private readonly txActions: TransactionActions,
    private readonly monzo: MonzoService,
    private readonly http: HttpClient
  ) {}

  get createdTime() {
    return format(this.tx.created, 'h:mma - Do MMMM YYYY')
  }

  get txAmount(): string {
    let amount = this.tx.amount.html({
      signMode: SignModes.Never
    })

    if (this.tx.amount.foreign) {
      amount += (this.tx.amount.exchanged as Amount).html({
        signMode: SignModes.Never
      })
    }

    return amount
  }

  get txBalance(): string {
    return this.tx.balance.html({
      signMode: SignModes.Never
    })
  }

  get emoji() {
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

  get hasAttachments() {
    return this.tx.attachments && this.tx.attachments.length
  }

  iconFallback() {
    this.$icon.nativeElement.src = this.tx.iconFallback
  }

  async uploadAttachment(ev: Event) {
    ev.preventDefault()

    const file: File = this.$uploader.nativeElement.files[0]
    console.log(file)

    const contentType = 'image/jpeg'

    const {
      upload_url: uploadUrl,
      file_url: fileUrl
    } = await this.monzo.request<MonzoAttachmentUploadResponse>(
      this.tx.attachmentUploadRequest(contentType)
    )
    console.log('got attachment upload url', uploadUrl)

    const headers = new HttpHeaders()
    headers.set('Content-Type', contentType)

    await this.http
      .put(uploadUrl, file, {
        headers
      })
      .toPromise()

    console.log('done uploading')

    const registerRes = await this.monzo.request<{
      attachment: MonzoAttachmentResponse
    }>(this.tx.attachmentRegisterRequest(fileUrl, contentType))

    console.log('registered attachment', fileUrl, registerRes)
  }

  @dispatch()
  updateNotes() {
    return this.txActions.updateTransactionNotes(
      this.tx,
      this.$notes.nativeElement.value
    )
  }
}
