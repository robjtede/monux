import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'

// third party modules
import { StoreModule, ActionReducerMap } from '@ngrx/store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { NgReduxModule, NgRedux } from '@angular-redux/store'
import { Ng2ImgToolsModule } from 'ng2-img-tools'

import { environment } from '../environments/environment'

// redux
import { AppState, reducers } from './store'

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
import { CacheService } from './services/cache.service'

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
      selectedTransaction: reducers.selectedTransactionReducer
    } as ActionReducerMap<AppState>),
    StoreDevtoolsModule.instrument({
      logOnly: environment.production,
      maxAge: environment.production ? false : 50
    })
  ],
  providers: [
    MonzoService,
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
