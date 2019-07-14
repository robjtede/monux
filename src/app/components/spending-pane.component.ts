import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild
} from '@angular/core'
import { Store } from '@ngrx/store'
import { PieChartComponent } from '@swimlane/ngx-charts'
import { schemeCategory10 as colorScheme } from 'd3'
import {
  GroupingStrategy,
  groupTransactions,
  Transaction
} from '../../../../monzolib/dist'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { AppState } from '../store'

@Component({
  selector: 'm-spending-pane',
  templateUrl: './spending-pane.component.html',
  styleUrls: ['./spending-pane.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.pane]': 'true'
  }
})
export class SpendingPaneComponent implements OnInit, AfterContentInit {
  @ViewChild(PieChartComponent, { static: true }) $chart!: PieChartComponent

  legendTitle = 'This Month'
  data!: Observable<TooltipData[]>

  colorScheme = {
    domain: colorScheme
  }

  constructor(private store$: Store<AppState>) {}

  ngOnInit() {
    this.data = this.store$.select('transactions').pipe(
      map(txs => {
        return groupTransactions(
          txs.map((tx: any) => new Transaction(tx)),
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
      })
    )
  }

  ngAfterContentInit() {
    // HACK: for consistent graph sizing due to container dimensions
    // not updated in time
    setTimeout(() => {
      this.$chart.update()
    }, 0)
  }

  ttt(params: TooltipTextParams) {
    return `£${params.data.value.toFixed(2)}`
  }
}

interface TooltipData {
  name: string
  value: number
}

interface TooltipTextParams {
  data: TooltipData
  endAngle: number
  index: number
  padAngle: number
  pos: number[]
  startAngle: number
  value: number
}
