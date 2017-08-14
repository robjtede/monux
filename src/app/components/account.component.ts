import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { Observable } from 'rxjs'

import Account from '../../lib/monzo/Account'

@Component({
  selector: 'm-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent {
  @Input() readonly holder: Account

  readonly bank: string = 'monux'
}
