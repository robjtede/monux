import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'm-btn',
  template: `
    <button>
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['btn.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BtnComponent {}
