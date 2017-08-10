import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core'
import { NgRedux } from '@angular-redux/store'

import { IState } from './store'

import Amount from '../lib/monzo/Amount'

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

  constructor(private ngRedux: NgRedux<IState>) {}

  ngOnInit(): void {
    console.log('monux started')

    console.log(this.ngRedux.getState())
  }

  ngOnDestroy(): void {
    console.log('monux stopped')
  }
}
