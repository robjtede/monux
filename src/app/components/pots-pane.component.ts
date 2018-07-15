import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Pot } from 'monzolib'
import { Store } from '@ngrx/store'

import { AppState } from '../store'

@Component({
  selector: 'm-pots-pane',
  templateUrl: 'pots-pane.component.html',
  styleUrls: ['pots-pane.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PotsPaneComponent implements OnInit {
  pots$!: Observable<Pot[]>

  constructor(private store$: Store<AppState>) {}

  ngOnInit(): void {
    this.pots$ = this.store$
      .select('pots')
      .pipe(map(pots => pots.map(pot => new Pot(pot))))
  }
}
