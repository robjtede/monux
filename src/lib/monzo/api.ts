import { HttpHeaders } from '@angular/common/http'
import { Primitive } from 'json-types'

type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS'

export interface QueryString {
  [key: string]: Primitive | undefined
}

export interface MonzoRequest {
  path: string
  qs?: QueryString
  method?: HttpMethods
  json?: boolean
  headers?: HttpHeaders
}
