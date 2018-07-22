import { randomBytes } from 'crypto'
import { ipcRenderer, EventEmitter } from 'electron'
import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnInit,
  OnDestroy
} from '@angular/core'
import { Router } from '@angular/router'
import Debug = require('debug')
import {
  AppInfo,
  parseAuthUrl,
  accessTokenRequest,
  getAuthRequestUrl
} from 'monzolib'

import { MonzoService } from '../services/monzo.service'

const debug = Debug('app:component:auth-request')

@Component({
  selector: 'm-auth-request',
  templateUrl: './auth-request.component.html',
  styleUrls: ['./auth-request.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthRequestComponent implements OnInit, OnDestroy {
  constructor(
    private monzo: MonzoService,
    private router: Router,
    private zone: NgZone
  ) {}

  state = new Promise<string>((resolve, reject) => {
    randomBytes(128, (err, buf) => {
      if (err) reject(err)
      resolve(buf.toString('hex'))
    })
  })

  ngOnInit(): void {
    debug('init')

    ipcRenderer.on(
      'auth-verify:monzo',
      async (_ev: EventEmitter, authUrl: string) => {
        debug('requesting auth with url', authUrl)
        this.authenticate(authUrl)
      }
    )

    // this.openAuthRequest()
  }

  async getAppInfo(): Promise<AppInfo> {
    return {
      client_id: await this.monzo.getCode('client_id'),
      client_secret: await this.monzo.getCode('client_secret'),
      redirect_uri: 'https://monux.robjte.de/auth/',
      response_type: 'code',
      state: await this.state
    }
  }

  async authenticate(authUrl: string) {
    const authCode = parseAuthUrl(authUrl, await this.state)
    const tokenRequest = accessTokenRequest(await this.getAppInfo(), authCode)

    this.monzo.getAccess(tokenRequest).subscribe(success => {
      if (success) {
        debug('auth verification successful')

        // send signal to close auth window
        ipcRenderer.send('auth-success:monzo')

        // run redirect in angular's zone so components init correctly
        this.zone.run(() => {
          this.router.navigate(['/app'])
        })
      } else {
        console.error('auth failed')
      }
    })
  }

  openAuthRequest(ev?: MouseEvent) {
    if (ev) {
      ev.preventDefault()
      ev.stopPropagation()
    }

    debug('sending signal to open auth window')

    setTimeout(async () => {
      ipcRenderer.send(
        'open-auth-window',
        getAuthRequestUrl(await this.getAppInfo())
      )
    }, 1000)
  }

  manualCode(ev: Event, url: string) {
    ev.preventDefault()
    ev.stopPropagation()

    debug('manually authenticatin with url')
    this.authenticate(url)
  }

  ngOnDestroy() {
    debug('destroy')
  }
}
