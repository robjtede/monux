import { ipcRenderer, EventEmitter } from 'electron'
import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnInit
} from '@angular/core'
import { Router } from '@angular/router'
import Debug = require('debug')

import { MonzoService } from '../services/monzo.service'

const debug = Debug('app:component:auth-request')

@Component({
  selector: 'm-auth-request',
  templateUrl: './auth-request.component.html',
  styleUrls: ['./auth-request.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthRequestComponent implements OnInit {
  constructor(
    private monzo: MonzoService,
    private router: Router,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    ipcRenderer.on(
      'auth-verify:monzo',
      (_ev: EventEmitter, accessToken: string) => {
        this.monzo.verifyAccess(accessToken).subscribe(res => {
          if (res) {
            debug('auth verification successful')

            // send signal to close auth window
            ipcRenderer.send('auth-success:monzo', true)

            // run redirect in angular's zone so components init correctly
            this.zone.run(() => {
              this.router.navigate(['/app'])
            })
          } else {
            console.error('auth failed')
          }
        })
      }
    )

    this.openAuthRequest()
  }

  openAuthRequest(ev?: MouseEvent) {
    if (ev) {
      ev.preventDefault()
      ev.stopPropagation()
    }

    debug('sending signal to open auth window')

    setTimeout(() => ipcRenderer.send('open-auth-window', 'monzo'), 1000)
  }

  manualCode(ev: Event, token: string) {
    ev.preventDefault()
    ev.stopPropagation()

    debug('sending manually entered code')
    ipcRenderer.send('auth-verify:monzo', token)
  }
}
