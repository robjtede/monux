import { Component, ChangeDetectionStrategy } from '@angular/core'
import { NgRedux } from '@angular-redux/store'
import { Observable } from 'rxjs'

import { AppState } from '../store'
import Account, { MonzoAccountResponse } from '../../lib/monzo/Account'

@Component({
  selector: 'm-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent {
  private readonly holder$: Observable<string>
  private readonly bank$: Observable<string> = Observable.of('monux')

  constructor(private readonly redux: NgRedux<AppState>) {
    this.holder$ = this.redux
      .select<MonzoAccountResponse>(['account', 'monzo'])
      .map(acc => {
        return acc ? new Account(acc).name : 'Loading...'
      })
  }
}
