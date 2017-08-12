import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core'
import { NgRedux } from '@angular-redux/store'
import { Observable } from 'rxjs'

import { AppState } from './store'
import { BalanceActions } from './actions/balance'
import { TransactionActions } from './actions/transaction'

import Amount, { AmountOpts } from '../lib/monzo/Amount'

import './style/index.css'

@Component({
  selector: 'monux-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  readonly name = 'Monux'

  private readonly balance$: Observable<Amount>
  private readonly spent$: Observable<Amount>

  constructor(
    private readonly redux: NgRedux<AppState>,
    private readonly balanceActions: BalanceActions,
    private readonly transactionActions: TransactionActions
  ) {
    this.balance$ = this.redux
      .select<AmountOpts>('balance')
      .map(balance => new Amount(balance))

    this.spent$ = this.redux
      .select<AmountOpts>('spent')
      .map(spent => new Amount(spent))
  }

  ngOnInit(): void {
    console.log('monux started')

    this.redux.dispatch(this.balanceActions.getBalance())
    this.redux.dispatch(this.transactionActions.getTransactions())
  }

  ngOnDestroy(): void {
    console.log('monux stopped')
  }
}
