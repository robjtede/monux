import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { Account } from 'monzolib'

@Component({
  selector: 'm-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent {
  @Input() readonly account!: Account

  get profilePictureUrl(): string {
    if (this.account) {
      return `https://api.monzo.com/user-images/profile_picture/${
        this.account.userId
      }`
    } else {
      return '../app/assets/icons/monzo.png'
    }
  }
}
