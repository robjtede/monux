import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild
} from '@angular/core'
import { Ng2ImgToolsService } from 'ng2-img-tools'

import { MonzoService } from '../services/monzo.service'

import Transaction, {
  MonzoAttachmentResponse
} from '../../lib/monzo/Transaction'

@Component({
  selector: 'm-transaction-attachment',
  templateUrl: './transaction-attachment.component.html',
  styleUrls: ['./transaction-attachment.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {}
})
export class TransactionAttachmentComponent implements OnInit {
  @Input() readonly attachment: MonzoAttachmentResponse
  @Input() readonly tx: Transaction

  @ViewChild('attachment') $attachment: ElementRef

  // private readonly redux: NgRedux<AppState>,
  // private readonly txActions: TransactionActions
  constructor(
    private monzo: MonzoService,
    private imgTools: Ng2ImgToolsService
  ) {}

  ngOnInit() {
    this.orientImage()
  }

  orientImage() {
    const img = new Image()
    img.src = this.attachment.url

    img.addEventListener('load', async () => {
      const rotatedImg = await this.imgTools.getEXIFOrientedImage(img)

      this.$attachment.nativeElement.src = rotatedImg.src
    })
  }

  async delete() {
    try {
      const req = this.tx.attachmentDeregisterRequest(this.attachment.id)
      const res = await this.monzo.request(req)

      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }
}
