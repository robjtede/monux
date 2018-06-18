import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'map-pane',
  template: `
    <div>
      <h1>🗺️ Map View</h1>
      <h2>View the location of all your transactions on one map.</h2>
      <h3>🚀️ Coming soon...</h3>
    </div>

    <!-- <m-map></m-map> -->
  `,
  styleUrls: ['unfinished-pane.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.pane]': 'true'
  }
})
export class MapPaneComponent {}
