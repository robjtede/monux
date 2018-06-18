import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'export-pane',
  template: `
    <div>
      <h1>📒️ Export</h1>
      <h2>Generate reports and export to CSV or Excel.</h2>
      <h3>🚀️ Coming soon...</h3>
    </div>

    <!-- <m-export></m-export> -->
  `,
  styleUrls: ['unfinished-pane.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.pane]': 'true'
  }
})
export class ExportPaneComponent {}
