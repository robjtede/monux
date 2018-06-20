import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnInit
} from '@angular/core'
import { Router } from '@angular/router'
import { combineLatest, of } from 'rxjs'
import { catchError, tap, first } from 'rxjs/operators'
import Debug = require('debug')

import { MonzoService } from '../services/monzo.service'

const debug = Debug('app:component:get-client-info')

@Component({
  selector: 'm-get-client-info',
  templateUrl: './get-client-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GetClientInfoComponent implements OnInit {
  constructor(private monzo: MonzoService, private router: Router) {}

  ngOnInit(): void {
    debug('component initialized')
  }

  saveClientInfo(ev: Event, clientId: string, clientSecret: string): void {
    ev.preventDefault()
    ev.stopPropagation()

    debug('saving client info')

    combineLatest(
      this.monzo.saveCode('client_id', clientId),
      this.monzo.saveCode('client_secret', clientSecret)
    ).subscribe(() => {
      debug('saved id and secret')
      this.router.navigate(['/auth-request'])
    })
  }
}
