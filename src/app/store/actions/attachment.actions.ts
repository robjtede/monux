import { Action } from '@ngrx/store'

import { suffixes } from './'

import { Attachment } from '../../../lib/monzo/Attachment'

export const DEREGISTER_ATTACHMENT = '[Attachment] HTTP/Post Deregister'
export const DEREGISTER_ATTACHMENT_FAILED = `${DEREGISTER_ATTACHMENT} ${
  suffixes.failed
}`

export class DeregisterAttachmentAction implements Action {
  readonly type = DEREGISTER_ATTACHMENT
  constructor(public payload: Attachment) {}
}
export class DeregisterAttachmentFailedAction implements Action {
  readonly type = DEREGISTER_ATTACHMENT_FAILED
}
