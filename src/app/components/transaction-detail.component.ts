import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild
} from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Store } from '@ngrx/store'
import { format } from 'date-fns'

import 'rxjs-compat/operator/toPromise'

import {
  MonzoAttachmentUploadResponse,
  MonzoAttachmentResponse
} from '../../lib/monzo/Attachment'
import { SignModes } from '../../lib/monzo/Amount'
import { Transaction } from '../../lib/monzo/Transaction'

import { MonzoService } from '../services/monzo.service'
import { AppState } from '../store'
import { PatchTransactionNotesAction } from '../store/actions/transactions.actions'

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

  constructor(
    private http: HttpClient,
    private monzo: MonzoService,
    private store$: Store<AppState>
  ) {}

  ngAfterContentChecked() {
    console.log('content checked')
  }

  ngAfterViewChecked() {
    console.log('view checked')
  }

  get createdTime() {
    return format(this.tx.created, 'h:mma - Do MMMM YYYY')
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

  get showAmount(): boolean {
    return !this.tx.is.metaAction && !this.tx.declined
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
    } = await this.monzo
      .request<MonzoAttachmentUploadResponse>(
        this.tx.attachmentUploadRequest(contentType)
      )
      .toPromise()

    console.log('got attachment upload url', uploadUrl, fileUrl)

    const headers = new HttpHeaders()
    headers.set('Content-Type', contentType)

    await this.http
      .put(uploadUrl, file, {
        headers
      })
      .toPromise()

    console.log('done uploading')

    const registerRes = await this.monzo
      .request<{
        attachment: MonzoAttachmentResponse
      }>(this.tx.attachmentRegisterRequest(fileUrl, contentType))
      .toPromise()

    console.log('registered attachment', fileUrl, registerRes)
  }

  updateNotes(notes: string) {
    return this.store$.dispatch(
      new PatchTransactionNotesAction(this.tx.json, notes)
    )
  }
}
