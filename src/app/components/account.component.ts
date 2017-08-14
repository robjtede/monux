import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'm-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent {
  @Input() readonly holder: string = 'Loading...'

  readonly bank: string = 'monux'
}
