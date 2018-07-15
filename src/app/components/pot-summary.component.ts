import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Input
} from '@angular/core'
import { Pot } from 'monzolib'

@Component({
  selector: 'm-pot-summary',
  templateUrl: 'pot-summary.component.html',
  styleUrls: ['pot-summary.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PotSummaryComponent implements OnInit {
  @Input() pot!: Pot
}
