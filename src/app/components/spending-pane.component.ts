import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'm-spending-pane',
  template: `
    <div class="spending-list">
      <h1>Months</h1>
    </div>
    <div class="spending-vis">
      <h1>This Month</h1>
      <svg>
        <g>
          <text class="label"></text>
          <text class="amount"></text>
        </g>
      </svg>
    </div>
    <!-- <m-spending></m-spending> -->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.pane]': 'true'
  }
})
export class SpendingPaneComponent {}
