import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core'

import Amount from '../lib/monzo/Amount'

import '../index.css'

@Component({
  selector: 'monux-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent implements OnInit, OnDestroy {
  public readonly name = 'Monux'

  balance: Amount = new Amount({
    amount: 1.23,
    currency: 'GBP'
  })

  spent: Amount = new Amount({
    amount: 1.23,
    currency: 'GBP'
  })

  accountName: string = 'Rob Ede'

  ngOnInit(): void {
    console.log('monux started')
  }

  ngOnDestroy(): void {
    console.log('monux stopped')
  }
}
