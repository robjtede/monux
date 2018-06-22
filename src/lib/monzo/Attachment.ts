import { JSONMap } from 'json-types'
import { MonzoRequest } from './api'

export class Attachment {
  constructor(private readonly att: MonzoAttachmentResponse) {}

  get created() {
    return this.att.created
  }

  get txId() {
    return this.att.external_id
  }

  get id() {
    return this.att.id
  }

  get type() {
    return this.att.type
  }

  get url() {
    return this.att.url
  }

  get userId() {
    return this.att.user_id
  }

  attachmentDeregisterRequest(): MonzoRequest {
    return {
      path: '/attachment/deregister',
      qs: {
        id: this.id
      },
      method: 'POST'
    }
  }

  get json(): MonzoAttachmentResponse {
    return this.att
  }

  get stringify(): string {
    return JSON.stringify(this.json)
  }
}

export interface MonzoAttachmentResponse extends JSONMap {
  created: string
  external_id: string
  // TODO: full mime-type list
  file_type: string
  file_url: string
  id: string
  user_id: string
}

export interface MonzoAttachmentOuterResponse extends JSONMap {
  attachment: MonzoAttachmentResponse
}

export interface MonzoAttachmentUploadResponse extends JSONMap {
  file_url: string
  upload_url: string
}
