import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core'
import { NgRedux, select } from '@angular-redux/store'
import { Observable } from 'rxjs'

import { MonzoService } from './services/monzo.service'

import { AppState } from './store'
import { BalanceActions } from './actions/balance'

import Amount, { AmountOpts } from '../lib/monzo/Amount'

import './style/index.css'

@Component({
  selector: 'monux-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent implements OnInit, OnDestroy {
  readonly name = 'Monux'

  private readonly balance$: Observable<Amount>
  private readonly spent$: Observable<Amount>

  constructor(
    private readonly redux: NgRedux<AppState>,
    private readonly balanceActions: BalanceActions
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
    // this.redux.dispatch(this.balanceActions.getBalance())
  }

  ngOnDestroy(): void {
    console.log('monux stopped')
  }
}
