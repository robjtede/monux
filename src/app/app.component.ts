import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core'
import { select, Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { combineLatest, filter, map } from 'rxjs/operators'
import { startOfMonth, subMonths } from 'date-fns'

import { AppState } from './store'
import { GetBalanceAction } from './store/actions/balance.actions'
import { BalanceEffects } from './store/effects/balance.effects'

import { MonzoService } from './services/monzo.service'
import { Account, MonzoAccountResponse } from '../lib/monzo/Account'
import { Amount, AmountOpts } from '../lib/monzo/Amount'
import { Transaction, MonzoTransactionResponse } from '../lib/monzo/Transaction'

@Component({
  selector: 'monux-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent implements OnInit, OnDestroy {
  readonly name = 'Monux'

  readonly selectedTxId$: Observable<string | undefined>
  readonly accountHolder$: Observable<string>
  readonly balance$: Observable<Amount>
  readonly spent$: Observable<Amount>
  // readonly txs$: Observable<Transaction[]>
  // readonly selectedTx$: Observable<Transaction | undefined>

  constructor(private readonly store$: Store<AppState>) {
    this.selectedTxId$ = this.store$.select('selectedTransaction')

    this.balance$ = this.store$.pipe(
      select('balance'),
      filter(balance => !!balance),
      map(
        ({ balance, currency }) =>
          new Amount({
            native: {
              amount: balance,
              currency: currency
            }
          })
      )
    )

    this.accountHolder$ = this.store$
      .select<MonzoAccountResponse>('account')
      .pipe(
        filter(acc => !!acc),
        map(acc => new Account(acc).name)
      )

    this.spent$ = this.store$.pipe(
      select('balance'),
      filter(balance => !!balance),
      map(
        ({ spend_today, currency }) =>
          new Amount({
            native: {
              amount: spend_today,
              currency: currency
            }
          })
      )
    )

    // this.txs$ = this.store$.pipe(
    //   select<MonzoTransactionResponse[]>('transactions'),
    //   map(txs => txs.map(tx => new Transaction(tx)))
    // )

    // this.selectedTx$ = this.selectedTxId$.pipe(
    //   combineLatest(this.txs$),
    //   filter(([txId, txs]) => !!txId && !!txs.length),
    //   map(([txId, txs]) => txs.find(tx => tx.id === txId))
    // )
  }

  ngOnInit(): void {
    console.log('monux started')

    // start of month
    // const som = subMonths(startOfMonth(Date.now()), 1)

    // this.redux.dispatch(this.txActions.loadTransactions({ since: som }))
    // this.redux.dispatch(this.txActions.getNewTransactions())
    // this.redux.dispatch(this.txActions.getPendingTransactions())
  }

  ngOnDestroy(): void {
    console.log('monux stopped')
  }
}
