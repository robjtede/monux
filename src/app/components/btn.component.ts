import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

@Component({
  selector: 'm-btn',
  template: `
    <button [type]="type">
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['btn.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BtnComponent {
  @Input() type = 'submit'
}
