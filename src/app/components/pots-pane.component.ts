import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy
} from '@angular/core'
import { Observable, BehaviorSubject, combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'
import { Pot } from 'monzolib'
import { Store } from '@ngrx/store'
import Debug = require('debug')

import { AppState } from '../store'

const debug = Debug('app:component:pots-pane')

@Component({
  selector: 'm-pots-pane',
  templateUrl: 'pots-pane.component.html',
  styleUrls: ['pots-pane.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PotsPaneComponent implements OnInit, OnDestroy {
  pots$!: Observable<Pot[]>
  filteredPots$!: Observable<Pot[]>

  private filter$: BehaviorSubject<PotFilter> = new BehaviorSubject<PotFilter>(
    (window.localStorage.getItem('potFilter') as PotFilter) || 'all'
  )

  constructor(private store$: Store<AppState>) {}

  ngOnInit(): void {
    debug('init')

    this.pots$ = this.store$.select('pots').pipe(
      map(pots =>
        pots.map(pot => new Pot(pot)).sort((a, b) => {
          // sort by deleted then updated date
          if (a.deleted === b.deleted) {
            // most recently updated first
            return +b.updated - +a.updated
          } else {
            // active first
            return +a.deleted - +b.deleted
          }
        })
      )
    )

    this.filteredPots$ = combineLatest(this.pots$, this.filter$).pipe(
      map(([pots, filter]) => {
        return pots.filter(pot => {
          if (filter === 'open') {
            return !pot.deleted
          } else if (filter === 'deleted') {
            return pot.deleted
          } else {
            return true
          }
        })
      })
    )
  }

  ngOnDestroy() {
    debug('destroy')
  }

  setFilter(filter: PotFilter) {
    this.filter$.next(filter)
    window.localStorage.setItem('potFilter', filter)
  }
}

type PotFilter = 'all' | 'open' | 'deleted'
