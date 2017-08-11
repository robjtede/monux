import { Component, ChangeDetectionStrategy } from '@angular/core'
import { NgRedux, select } from '@angular-redux/store'
import { Observable } from 'rxjs'

import { AppState } from '../store'
import Account from '../../lib/monzo/Account'

@Component({
  selector: 'm-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AccountComponent {
  @select(({ account: { monzo } }: AppState) => {
    return monzo ? new Account(monzo).name : 'Loading...'
  })
  private readonly holder$: Observable<string>

  private readonly bank: string = 'monux'

  constructor(private readonly redux: NgRedux) {}
}
