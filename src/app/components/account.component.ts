import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { IMonzoApiAccount } from '../../lib/monzo/Account'

@Component({
  selector: 'm-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AccountComponent {
  @Input() private account: string
  private bank: string = 'monux'
}
