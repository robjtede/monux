import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { schemeSet1 } from 'd3'
import { AppState } from '../store'

import { txdata } from '../txdata'
import { Transaction } from '../../lib/monzo/Transaction'
import { GroupingStrategy, groupTransactions } from '../../lib/monzo/helpers'

@Component({
  selector: 'm-spending-pane',
  template: `
    <div class="spending-vis" style="flex: 1;">
      <ngx-charts-pie-chart
        [results]="data"
        [doughnut]="true"
        [legend]="true"
        [legendTitle]="legendTitle"
        [scheme]="colorScheme"
        [labels]="true"
        [trimLabels]="false"
      ></ngx-charts-pie-chart>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.pane]': 'true'
  }
})
export class SpendingPaneComponent implements OnInit {
  legendTitle = 'This Month'

  data = groupTransactions(
    txdata.map((tx: any) => new Transaction(tx)),
    GroupingStrategy.Category
  ).map(cat => {
    return {
      name: cat.id,
      value: cat.txs.reduce(
        (sum, tx) => sum + (tx.amount.negative ? tx.amount.amount : 0),
        0
      )
    }
  })

  colorScheme = {
    domain: schemeSet1
  }

  constructor(private store$: Store<AppState>) {}

  ngOnInit() {}
}
