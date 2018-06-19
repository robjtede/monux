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

            this.zone.run(() => {
              // running in zone so ngOnInit will fire
              this.router.navigate(['/app'])
            })
          } else {
            console.error('auth failed')
          }
        })
      }
    )
  }

  openAuthRequest(ev: MouseEvent) {
    ev.preventDefault()
    ev.stopPropagation()

    if (ev.target) {
      debug('opening auth request window')

      ipcRenderer.send('open-auth-window', 'monzo')
    }
  }

  manualCode(ev: Event, token: string) {
    ev.preventDefault()
    ev.stopPropagation()

    debug('sending manually entered code')
    ipcRenderer.send('auth-verify:monzo', token)
  }
}
