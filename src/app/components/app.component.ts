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

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

import { AppState, DefiniteAccountState, DefiniteBalanceState } from '../store'

import { Account } from '../../lib/monzo/Account'
import { Amount } from '../../lib/monzo/Amount'
import { extractBalanceAndSpent } from '../../lib/monzo/helpers'
import { LogoutAction } from '../store/actions/account.actions'

const debug = Debug('app:component:app')

library.add(fas, far, fab)

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

  constructor(private store$: Store<AppState>) {}

  ngOnInit() {
    debug('app started')

    this.accountHolder$ = this.store$.select('account').pipe(
      filter<DefiniteAccountState>(acc => !!acc),
      map(acc => new Account(acc).name)
    )

    this.balance$ = this.store$.select('balance').pipe(
      filter<DefiniteBalanceState>(balance => !!balance),
      map(balanceRes => extractBalanceAndSpent(balanceRes).balance)
    )

    this.spent$ = this.store$.select('balance').pipe(
      filter<DefiniteBalanceState>(balance => !!balance),
      map(balanceRes => extractBalanceAndSpent(balanceRes).spent)
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
