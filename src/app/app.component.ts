import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core'
import { NgRedux } from '@angular-redux/store'

import { MonzoService } from './services/monzo.service'

import { IState } from './store'
import { setAccount } from './actions/account'

import Amount from '../lib/monzo/Amount'
import { accountsRequest, MonzoAccountsResponse } from '../lib/monzo/Account'

import './style/index.css'

@Component({
  selector: 'monux-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent implements OnInit, OnDestroy {
  readonly name = 'Monux'

  readonly balance: Amount = new Amount({
    native: {
      amount: 1.23,
      currency: 'GBP'
    }
  })

  readonly spent: Amount = new Amount({
    native: {
      amount: 1.23,
      currency: 'GBP'
    }
  })

  constructor(
    private readonly redux: NgRedux<IState>,
    private readonly monzo: MonzoService
  ) {}

  ngOnInit(): void {
    console.log('monux started')

    this.getAccount()
  }

  ngOnDestroy(): void {
    console.log('monux stopped')
  }

  async getAccount() {
    const { accounts } = await this.monzo.request<MonzoAccountsResponse>(
      accountsRequest
    )

    this.redux.dispatch(setAccount('monzo', accounts[0]))
  }
}
