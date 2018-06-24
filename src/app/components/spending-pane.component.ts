import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core'
import { Store } from '@ngrx/store'
import * as d3 from 'd3'

import { Amount } from '../../lib/monzo/Amount'
import { Transaction } from '../../lib/monzo/Transaction'
import { AppState } from '../store'

@Component({
  selector: 'm-spending-pane',
  template: `
    <div class="spending-vis">
      <h1>This Month</h1>
      <svg #chart>
          <g>
            <text class="label"></text>
            <text class="amount"></text>
          </g>
      </svg>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.pane]': 'true'
  }
})
export class SpendingPaneComponent implements OnInit {
  @ViewChild('chart') chart!: ElementRef<SVGSVGElement>

  constructor(private store$: Store<AppState>) {}

  ngOnInit() {
    console.log('TODO')
  }
}
