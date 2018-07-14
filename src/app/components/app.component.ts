import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { Store } from '@ngrx/store'
import Debug = require('debug')
import { Account, Amount, extractBalanceAndSpent } from 'monzolib'
import { Observable } from 'rxjs'
import { filter, map } from 'rxjs/operators'

import { ModalService } from '../services/modal.service'
import { AppState, DefiniteAccountState, DefiniteBalanceState } from '../store'
import { LogoutAction } from '../store/actions/account.actions'

const debug = Debug('app:component:app')

library.add(fas, far, fab)

@Component({
  selector: 'm-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  accountHolder$!: Observable<string>
  balance$!: Observable<Amount>
  spent$!: Observable<Amount>
  modalOpen$!: Observable<boolean>

  constructor(private store$: Store<AppState>, private modal: ModalService) {}

  ngOnInit() {
    debug('app started')

    this.accountHolder$ = this.store$.select('account').pipe(
      filter<DefiniteAccountState>(acc => !!acc),
      map(acc => new Account(acc).name)
    )

    this.balance$ = this.store$.select('balance').pipe(
      filter<DefiniteBalanceState>(balance => !!balance),
      map(balanceRes => extractBalanceAndSpent(balanceRes).balance)
    )

    this.spent$ = this.store$.select('balance').pipe(
      filter<DefiniteBalanceState>(balance => !!balance),
      map(balanceRes => extractBalanceAndSpent(balanceRes).spent)
    )

    this.modalOpen$ = this.store$.select('modal').pipe(map(modal => modal.open))

    this.store$.dispatch({ type: '@monux/init' })
  }

  logout(ev?: MouseEvent) {
    if (ev) {
      ev.preventDefault()
      ev.stopPropagation()
    }

    debug('starting logout')
    this.store$.dispatch(new LogoutAction())
  }

  closeModal(ev?: MouseEvent, el?: HTMLElement) {
    if (ev && el) {
      if (ev.target === el) this.modal.close()
    } else {
      this.modal.close()
    }
  }

  ngOnDestroy() {
    debug('app component destroyed')
  }
}
