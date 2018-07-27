import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy
} from '@angular/core'
import { Attachment } from '../../../../monzolib/dist'
import Debug = require('debug')

const debug = Debug('app:component:attachment')

@Component({
  selector: 'm-transaction-attachment',
  templateUrl: './transaction-attachment.component.html',
  styleUrls: ['./transaction-attachment.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionAttachmentComponent implements OnInit, OnDestroy {
  @Input() readonly attachment!: Attachment

  @Output() delete = new EventEmitter<Attachment>()
  @Output() enlarge = new EventEmitter<Attachment>()

  ngOnInit(): void {
    debug('init')
  }

  enlargeAttachment(): void {
    this.enlarge.emit(this.attachment)
  }

  deleteAttachment(): void {
    this.delete.emit(this.attachment)
  }

  ngOnDestroy(): void {
    debug('destroy')
  }
}
