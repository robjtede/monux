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
import { ModalService } from '../services/modal.service'
import { ChangeCategoryAction } from '../store/actions/transactions.actions'

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

  constructor(private store$: Store<AppState>, private modal: ModalService) {}

  ngOnInit() {
    debug('init')
  }

  closeModal(ev?: MouseEvent) {
    if (ev) {
      ev.preventDefault()
      ev.stopPropagation()
    }

    this.modal.close()
  }

  changeCategory(category: string, ev?: MouseEvent) {
    if (ev) {
      ev.preventDefault()
      ev.stopPropagation()
    }

    this.store$.dispatch(new ChangeCategoryAction(this.tx, category))

    this.modal.close()
  }

  ngOnDestroy() {
    debug('destroy')
  }
}
