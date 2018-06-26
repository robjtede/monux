import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core'
import Debug = require('debug')

const debug = Debug('app:component:path-not-found')

@Component({
  selector: 'path-not-found',
  template: `
    <h2>Path not found</h2>
    <a routerLink="/">Go back to app</a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PathNotFoundComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    debug('path-not-found started')
  }

  ngOnDestroy(): void {
    debug('path-not-found stopped')
  }
}
