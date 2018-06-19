import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core'

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
    console.log('path-not-found started')
  }

  ngOnDestroy(): void {
    console.log('path-not-found stopped')
  }
}
