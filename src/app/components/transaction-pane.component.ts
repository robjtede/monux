import { Component, ChangeDetectionStrategy } from '@angular/core'
import { Store } from '@ngrx/store'
import { iif, Observable, combineLatest } from 'rxjs'
import { filter, map, tap } from 'rxjs/operators'

import { AppState } from '../store'
import { SelectTransactionAction } from '../store/actions/selectedTransaction.actions'

import { Transaction } from '../../lib/monzo/Transaction'

@Component({
  selector: 'transaction-pane',
  templateUrl: './transaction-pane.component.html',
  styleUrls: ['./transaction-pane.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.pane]': 'true'
  }
})
export class TransactionPaneComponent {
  readonly txs$: Observable<Transaction[]>
  readonly selectedTxId$: Observable<string | undefined>
  readonly selectedTx$: Observable<Transaction | undefined>

  constructor(private readonly store$: Store<AppState>) {
    this.selectedTxId$ = this.store$.select('selectedTransaction')

    this.txs$ = this.store$
      .select('transactions')
      .pipe(map(txs => txs.map(tx => new Transaction(tx))))

    this.selectedTx$ = combineLatest(this.selectedTxId$, this.txs$).pipe(
      filter(([txId, txs]) => !!txId && !!txs.length),
      map(([txId, txs]) => txs.find(tx => tx.id === txId))
    )
  }

  selectTx(txId: string): void {
    this.store$.dispatch(new SelectTransactionAction(txId))
  }
}
