import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import Debug = require('debug')

import { AppState } from '../store'

import { Account, MonzoAccountResponse } from '../../lib/monzo/Account'
import { Amount, MonzoBalanceResponse } from '../../lib/monzo/Amount'
import { LogoutAction } from '../store/actions/account.actions'
import { CacheService } from '../services/cache.service'

const debug = Debug('app:component:app')

@Component({
  selector: 'm-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  accountHolder$!: Observable<string>
  balance$!: Observable<Amount>
  spent$!: Observable<Amount>

  constructor(private store$: Store<AppState>, private cache: CacheService) {}

  ngOnInit() {
    debug('app started')

    this.balance$ = this.store$.select('balance').pipe(
      filter(balance => !!balance),
      map(
        ({ balance, currency }: MonzoBalanceResponse) =>
          new Amount({
            native: {
              amount: balance,
              currency: currency
            }
          })
      )
    )

    this.accountHolder$ = this.store$.select('account').pipe(
      filter(acc => !!acc),
      map((acc: MonzoAccountResponse) => new Account(acc).name)
    )

    this.spent$ = this.store$.select('balance').pipe(
      filter(balance => !!balance),
      map(
        ({ spend_today, currency }: MonzoBalanceResponse) =>
          new Amount({
            native: {
              amount: spend_today,
              currency: currency
            }
          })
      )
    )

    this.store$.dispatch({ type: '@monux/init' })
  }

  logout(ev?: MouseEvent) {
    if (ev) {
      ev.preventDefault()
      ev.stopPropagation()
    }

    debug('starting logout')
    this.store$.dispatch(new LogoutAction())
  }

  ngOnDestroy() {
    debug('app component destroyed')
  }
}
