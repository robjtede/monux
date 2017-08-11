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

import Amount from '../lib/monzo/Amount'

import './style/index.css'

@Component({
  selector: 'monux-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [BalanceActions],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent implements OnInit, OnDestroy {
  readonly name = 'Monux'

  @select(({ balance }: AppState) => new Amount(balance))
  private readonly balance$: Observable<Amount>

  @select(({ spent }: AppState) => new Amount(spent))
  private readonly spent$: Observable<Amount>

  constructor(
    private readonly redux: NgRedux<AppState>,
    private readonly monzo: MonzoService,
    private readonly balanceActions: BalanceActions
  ) {}

  ngOnInit(): void {
    console.log('monux started')

    // this.getAccount()
    this.redux.dispatch(this.balanceActions.getBalance())
  }

  ngOnDestroy(): void {
    console.log('monux stopped')
  }
}
