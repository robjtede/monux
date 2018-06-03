import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core'
import { Store, select } from '@ngrx/store'
import { NgRedux } from '@angular-redux/store'
import { Observable } from 'rxjs'
import { combineLatest, filter, map } from 'rxjs/operators'
import { startOfMonth, subMonths } from 'date-fns'

import { AppState } from './store'
import { AppState as OldAppState } from './state'
import { BalanceActions } from './actions/balance'
import { TransactionActions } from './actions/transaction'

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
  readonly txs$: Observable<Transaction[]>
  readonly selectedTx$: Observable<Transaction | undefined>

  constructor(
    private readonly redux: NgRedux<OldAppState>,
    private readonly store: Store<AppState>,
    private readonly balanceActions: BalanceActions,
    private readonly txActions: TransactionActions
  ) {
    this.selectedTxId$ = this.store.pipe(select('selectedTransaction'))

    this.accountHolder$ = this.redux
      .select<MonzoAccountResponse>(['account', 'monzo'])
      .pipe(
        filter(acc => !!acc),
        map(acc => new Account(acc).name)
      )

    this.balance$ = this.redux
      .select<AmountOpts>('balance')
      .pipe(map(balance => new Amount(balance)))

    this.spent$ = this.redux
      .select<AmountOpts>('spent')
      .pipe(map(spent => new Amount(spent)))

    this.txs$ = this.redux
      .select<MonzoTransactionResponse[]>('transactions')
      .pipe(map(txs => txs.map(tx => new Transaction(tx))))

    this.selectedTx$ = this.selectedTxId$.pipe(
      combineLatest(this.txs$),
      filter(([txId, txs]) => !!txId && !!txs.length),
      map(([txId, txs]) => txs.find(tx => tx.id === txId))
    )

    this.txs$.subscribe(x => console.log(x))
    this.selectedTx$.subscribe(x => console.log(x))
  }

  ngOnInit(): void {
    console.log('monux started')

    this.redux.dispatch(this.balanceActions.loadBalance())
    this.redux.dispatch(this.balanceActions.getBalance())

    // start of month
    const som = subMonths(startOfMonth(Date.now()), 1)

    this.redux.dispatch(this.txActions.loadTransactions({ since: som }))
    this.redux.dispatch(this.txActions.getNewTransactions())
    this.redux.dispatch(this.txActions.getPendingTransactions())
  }

  ngOnDestroy(): void {
    console.log('monux stopped')
  }
}
