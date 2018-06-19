import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core'

@Component({
  selector: 'monux-root',
  template: `
    <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RootComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    console.log('monux started')
  }

  ngOnDestroy(): void {
    console.log('monux stopped')
  }
}
