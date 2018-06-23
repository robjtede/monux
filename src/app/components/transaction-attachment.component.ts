import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { Ng2ImgToolsService } from 'ng2-img-tools'

import { Attachment } from '../../lib/monzo/Attachment'

@Component({
  selector: 'm-transaction-attachment',
  templateUrl: './transaction-attachment.component.html',
  styleUrls: ['./transaction-attachment.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionAttachmentComponent implements OnInit {
  @Input() readonly attachment!: Attachment

  @Output() delete = new EventEmitter<Attachment>()

  @ViewChild('attachment') $attachment!: ElementRef

  constructor(private imgTools: Ng2ImgToolsService) {}

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

  deleteAttachment() {
    this.delete.emit(this.attachment)
  }
}
