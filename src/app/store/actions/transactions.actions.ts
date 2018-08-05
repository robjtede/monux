import { Action } from '@ngrx/store'
import {
  MonzoTransactionResponse,
  Transaction,
  TransactionRequestOpts
} from 'monzolib'

import { suffixes } from './'

/*
* action type strings
*/

const actionSinglePrefix = '[Transaction]'
const actionMultiplePrefix = '[Transactions]'

export const GET_TRANSACTIONS = `${actionMultiplePrefix} Get`
export const GET_TRANSACTIONS_SUCCESS = `${GET_TRANSACTIONS} ${
  suffixes.success
}`
export const GET_TRANSACTIONS_FAILED = `${GET_TRANSACTIONS} ${suffixes.failed}`
export const SET_TRANSACTIONS = `${actionMultiplePrefix} Set`

export const SET_TRANSACTION = `${actionSinglePrefix} Set`

export const APPEND_TRANSACTION = `${actionSinglePrefix} Append`

export const PATCH_TRANSACTION_NOTES = `${actionSinglePrefix} HTTP/Patch Note`
export const PATCH_TRANSACTION_NOTES_FAILED = `${PATCH_TRANSACTION_NOTES} ${
  suffixes.failed
}`

export const PATCH_CATEGORY = `${actionSinglePrefix} HTTP/Patch Category`
export const PATCH_CATEGORY_FAILED = `${PATCH_CATEGORY} ${suffixes.failed}`

export const UPLOAD_ATTACHMENT = `${actionSinglePrefix} HTTP/Put Upload Attachment`
export const UPLOAD_ATTACHMENT_FAILED = `${UPLOAD_ATTACHMENT} ${
  suffixes.failed
}`

export const HIDE_TRANSACTION = `${actionSinglePrefix} HTTP/Patch Hide`
export const HIDE_TRANSACTION_FAILED = `${HIDE_TRANSACTION} ${suffixes.failed}`

/*
 * action creators
 */

export class GetTransactionsAction implements Action {
  readonly type = GET_TRANSACTIONS
  constructor(
    public opts: TransactionRequestOpts,
    public append: boolean = false
  ) {}
}
export class GetTransactionsFailedAction implements Action {
  readonly type = GET_TRANSACTIONS_FAILED
}

export class SetTransactionsAction implements Action {
  readonly type = SET_TRANSACTIONS
  constructor(public payload: MonzoTransactionResponse[]) {}
}

export class AppendTransactionsAction implements Action {
  readonly type = APPEND_TRANSACTION
  constructor(public payload: MonzoTransactionResponse[]) {}
}

export class SetTransactionAction implements Action {
  readonly type = SET_TRANSACTION
  constructor(public tx: MonzoTransactionResponse) {}
}

export class PatchTransactionNotesAction implements Action {
  readonly type = PATCH_TRANSACTION_NOTES
  constructor(public tx: Transaction, public notes: string) {}
}
export class PatchTransactionNotesFailedAction implements Action {
  readonly type = PATCH_TRANSACTION_NOTES_FAILED
}

export class ChangeCategoryAction implements Action {
  readonly type = PATCH_CATEGORY
  constructor(public tx: Transaction, public category: string) {}
}
export class ChangeCategoryFailedAction implements Action {
  readonly type = PATCH_CATEGORY_FAILED
}

export class UploadAttachmentAction implements Action {
  readonly type = UPLOAD_ATTACHMENT
  constructor(public tx: Transaction, public file: File) {}
}
export class UploadAttachmentFailedAction implements Action {
  readonly type = UPLOAD_ATTACHMENT_FAILED
}

export class HideTransactionAction implements Action {
  readonly type = HIDE_TRANSACTION
  constructor(public tx: Transaction) {}
}
export class HideTransactionFailedAction implements Action {
  readonly type = HIDE_TRANSACTION_FAILED
}

/*
 * aggregate type
 */

export type Actions =
  | GetTransactionsAction
  | GetTransactionsFailedAction
  | SetTransactionsAction
  | AppendTransactionsAction
  | SetTransactionAction
  | PatchTransactionNotesAction
  | PatchTransactionNotesFailedAction
  | ChangeCategoryAction
  | ChangeCategoryFailedAction
  | UploadAttachmentAction
  | UploadAttachmentFailedAction
  | HideTransactionAction
  | HideTransactionFailedAction
