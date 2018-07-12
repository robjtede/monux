import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  Input
} from '@angular/core'
import { Store } from '@ngrx/store'
// import { Observable } from 'rxjs'
// import { filter, map } from 'rxjs/operators'
import Debug = require('debug')

import { AppState } from '../store'
import { Transaction } from '../../lib/monzo/Transaction'

const debug = Debug('app:component:category-dialog')

@Component({
  selector: 'm-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryDialogComponent implements OnInit, OnDestroy {
  @Input() tx!: Transaction

  categories = [
    'groceries',
    'transport',
    'entertainment',
    'eating_out',
    'cash',
    'general',
    'bills',
    'holidays',
    'shopping',
    'expenses',
    'family',
    'personal_care'
  ]

  constructor(private store$: Store<AppState>) {}

  ngOnInit() {
    debug('init')
  }

  ngOnDestroy() {
    debug('destroy')
  }
}
