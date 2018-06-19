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

const debug = Debug('app:component:get-client-info')

@Component({
  selector: 'm-get-client-info',
  templateUrl: './get-client-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GetClientInfoComponent implements OnInit {
  constructor(
    private monzo: MonzoService,
    private router: Router,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    debug('component initialized')
  }
}
