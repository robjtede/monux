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

import { Attachment } from '../../lib/monzo/Attachment'

@Component({
  selector: 'm-transaction-attachment',
  templateUrl: './transaction-attachment.component.html',
  styleUrls: ['./transaction-attachment.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {}
})
export class TransactionAttachmentComponent implements OnInit {
  @Input() readonly attachment!: Attachment

  @ViewChild('attachment') $attachment!: ElementRef

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
      const req = this.attachment.attachmentDeregisterRequest()
      const res = await this.monzo.request(req)

      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }
}
