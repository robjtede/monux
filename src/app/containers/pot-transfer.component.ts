import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  Input
} from '@angular/core'
import { Pot } from 'monzolib'

import Debug = require('debug')

const debug = Debug('app:component:pot-transfer')

@Component({
  selector: 'm-pot-transfer',
  templateUrl: './pot-transfer.component.html',
  styleUrls: ['./pot-transfer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PotTransferComponent implements OnInit, OnDestroy {
  @Input()
  pots!: Pot[]

  ngOnInit() {
    debug('init')
  }

  ngOnDestroy() {
    debug('destroy')
  }

  send(ev: Event) {
    console.log(ev.currentTarget)
  }
}
