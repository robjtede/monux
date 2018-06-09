// primary modules
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { StoreModule, ActionReducerMap } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'

// secondary modules
import { NgReduxModule, NgRedux } from '@angular-redux/store'
import { Ng2ImgToolsModule } from 'ng2-img-tools'

// environment
import { environment } from '../environments/environment'

// store
import { AppState, reducers } from './store'
import { effects } from './store/effects'

import { rootReducer as reducer } from './reducers'
import { middleware } from './middleware'
import { AppState as OldAppState } from './state'
import { AccountActions } from './actions/account'
import { BalanceActions } from './actions/balance'
import { SpentActions } from './actions/spent'
import { PaneActions } from './actions/pane'
import { TransactionActions } from './actions/transaction'

// directives
import { Autosize } from './directives/autosize.directive'

// pipes

// services
import { MonzoService } from './services/monzo.service'
import { MonzoOldService } from './services/monzo.old.service'
import { CacheService } from './services/cache.service'
import { CacheOldService } from './services/cache.old.service'

// components
import { AppComponent } from './app.component'
import { AmountComponent } from './components/amount.component'
import { AccountComponent } from './components/account.component'
import { TransactionListComponent } from './components/transaction-list.component'
import { TransactionGroupComponent } from './components/transaction-group.component'
import { TransactionSummaryComponent } from './components/transaction-summary.component'
import { TransactionAttachmentComponent } from './components/transaction-attachment.component'
import { TransactionDetailComponent } from './components/transaction-detail.component'

@NgModule({
  declarations: [
    Autosize,
    AppComponent,
    AmountComponent,
    AccountComponent,
    TransactionListComponent,
    TransactionGroupComponent,
    TransactionSummaryComponent,
    TransactionAttachmentComponent,
    TransactionDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgReduxModule,
    Ng2ImgToolsModule,
    StoreModule.forRoot({
      selectedTransaction: reducers.selectedTransactionReducer,
      balance: reducers.balanceReducer
    } as ActionReducerMap<AppState>),
    EffectsModule.forRoot(effects),
    StoreDevtoolsModule.instrument({
      logOnly: environment.production,
      maxAge: environment.production ? false : 50
    })
  ],
  providers: [
    MonzoService,
    MonzoOldService,
    CacheOldService,
    CacheService,
    AccountActions,
    BalanceActions,
    PaneActions,
    SpentActions,
    TransactionActions
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private readonly redux: NgRedux<OldAppState>) {
    this.redux.configureStore(reducer, {}, middleware)
  }
}
