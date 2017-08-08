import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core'

import Amount from '../lib/monzo/Amount'

import '../index.css'

@Component({
  selector: 'monux-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.Native,
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

  ngOnInit(): void {
    console.log('monux started')
  }

  ngOnDestroy(): void {
    console.log('monux stopped')
  }
}
