import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core'
import { NgRedux } from '@angular-redux/store'

import { MonzoService } from './services/monzo.service'

import { IState } from './store'

import Amount from '../lib/monzo/Amount'
import { accountsRequest } from '../lib/monzo/Account'

import './style/index.css'

@Component({
  selector: 'monux-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent implements OnInit, OnDestroy {
  public readonly name = 'Monux'

  balance: Amount = new Amount({
    native: {
      amount: 1.23,
      currency: 'GBP'
    }
  })

  spent: Amount = new Amount({
    native: {
      amount: 1.23,
      currency: 'GBP'
    }
  })

  accountName: string = 'Rob Ede'

  constructor(
    private ngRedux: NgRedux<IState>,
    private monzoService: MonzoService
  ) {}

  ngOnInit(): void {
    console.log('monux started')

    getAccount()
  }

  ngOnDestroy(): void {
    console.log('monux stopped')
  }

  async getAccount() {
    const data = await this.monzoService.request(accountsRequest)
    console.log(data)
  }
}
