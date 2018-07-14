import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { MonzoPotResponse } from 'monzolib'
import { Store } from '@ngrx/store'

import { AppState } from '../store'

@Component({
  selector: 'm-pots-pane',
  templateUrl: 'pots-pane.component.html',
  styleUrls: ['pots-pane.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PotsPaneComponent implements OnInit {
  pots!: Observable<MonzoPotResponse[]>

  constructor(private store$: Store<AppState>) {}

  ngOnInit(): void {
    this.pots = this.store$.select('pots')
  }
}
