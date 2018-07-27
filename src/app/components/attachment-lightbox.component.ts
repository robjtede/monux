import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core'
import { Store } from '@ngrx/store'
import Debug = require('debug')
import { Attachment } from 'monzolib'

import { ModalService } from '../services/modal.service'
import { AppState } from '../store'

const debug = Debug('app:component:attachment-lightbox')

@Component({
  selector: 'm-attachment-lightbox',
  templateUrl: './attachment-lightbox.component.html',
  styleUrls: ['./attachment-lightbox.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttachmentLightboxComponent implements OnInit, OnDestroy {
  @Input() attachment!: Attachment

  constructor(private modal: ModalService, private store$: Store<AppState>) {}

  ngOnInit() {
    debug(`init with`, this.attachment)
  }

  closeModal(ev?: MouseEvent) {
    if (ev) {
      ev.preventDefault()
      ev.stopPropagation()
    }

    this.modal.close()
  }

  ngOnDestroy() {
    debug('destroy')
  }
}
