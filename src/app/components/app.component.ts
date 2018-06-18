import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { filter, map } from 'rxjs/operators'

import { AppState } from '../store'

import { Account, MonzoAccountResponse } from '../../lib/monzo/Account'
import { Amount, MonzoBalanceResponse } from '../../lib/monzo/Amount'

@Component({
  selector: 'monux-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  readonly name = 'Monux'

  readonly accountHolder$: Observable<string>
  readonly balance$: Observable<Amount>
  readonly spent$: Observable<Amount>

  constructor(private readonly store$: Store<AppState>) {
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
  }

  ngOnInit(): void {
    console.log('monux started')

    // this.redux.dispatch(this.txActions.getNewTransactions())
    // this.redux.dispatch(this.txActions.getPendingTransactions())
  }

  ngOnDestroy(): void {
    console.log('monux stopped')
  }
}
