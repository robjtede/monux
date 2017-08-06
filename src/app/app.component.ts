import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core'
// import { NgRedux } from '@angular-redux/store'
import { Subscription } from 'rxjs'

import { IAmountOptions } from '../lib/monzo'

import '../index.css'

@Component({
  selector: 'monux-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent implements OnInit, OnDestroy {
  public readonly name = 'Monux'

  balance: IAmountOptions
  spent = '£2.97'
  subscription: Subscription

  // constructor(private ngRedux: NgRedux<IState>) {
  //   this.subscription = this.ngRedux
  //     .select<IBalanceState>('balance')
  //     .subscribe(newBalance => {
  //       console.log(newBalance)
  //       this.balance = newBalance
  //     })
  // }

  ngOnInit(): void {
    console.log('monux started')
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()

    console.log('monux stopped')
  }
}
