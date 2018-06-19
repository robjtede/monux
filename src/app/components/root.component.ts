import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core'
import Debug = require('debug')

const debug = Debug('app:component:root')

@Component({
  selector: 'm-root',
  template: `
    <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RootComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    debug('monux started')
  }

  ngOnDestroy(): void {
    debug('monux destroyed')
  }
}
