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
import { Attachment } from 'monzolib'
import { Ng2ImgToolsService } from 'ng2-img-tools'

@Component({
  selector: 'm-transaction-attachment',
  templateUrl: './transaction-attachment.component.html',
  styleUrls: ['./transaction-attachment.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionAttachmentComponent implements OnInit {
  @Input() readonly attachment!: Attachment

  @Output() delete = new EventEmitter<Attachment>()

  @ViewChild('attachment') $attachment!: ElementRef<HTMLImageElement>

  constructor(private imgTools: Ng2ImgToolsService) {}

  ngOnInit() {
    this.orientImage()
  }

  orientImage() {
    const img = new Image()
    img.src = this.attachment.url
    this.$attachment.nativeElement.src = this.attachment.url

    // TODO: improve performance
    // img.addEventListener('load', async () => {
    //   const rotatedImg = await this.imgTools.getEXIFOrientedImage(img)
    // })
  }

  deleteAttachment() {
    this.delete.emit(this.attachment)
  }
}
