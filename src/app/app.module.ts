import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { NgReduxModule, NgRedux, DevToolsExtension } from '@angular-redux/store'

// redux
import rootReducer from './reducers'
import middleware from './middleware'
import { AppState } from './store'

// services
import { MonzoService } from './services/monzo.service'
import { AccountActions } from './actions/account'
import { BalanceActions } from './actions/balance'
import { SpentActions } from './actions/spent'
import { PaneActions } from './actions/pane'
import { TransactionActions } from './actions/transaction'

// components
import { AppComponent } from './app.component'
import { AmountComponent } from './components/amount.component'
import { AccountComponent } from './components/account.component'
import { TransactionListComponent } from './components/transaction-list.component'
import { TransactionGroupComponent } from './components/transaction-group.component'
import { TransactionSummaryComponent } from './components/transaction-summary.component'

@NgModule({
  declarations: [
    AppComponent,
    AmountComponent,
    AccountComponent,
    TransactionListComponent,
    TransactionGroupComponent,
    TransactionSummaryComponent
  ],
  imports: [BrowserModule, HttpClientModule, NgReduxModule],
  providers: [
    MonzoService,
    AccountActions,
    BalanceActions,
    PaneActions,
    SpentActions,
    TransactionActions
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private readonly redux: NgRedux<AppState>,
    private readonly devTools: DevToolsExtension
  ) {
    const enhancers = this.devTools.isEnabled()
      ? [this.devTools.enhancer()]
      : []

    this.redux.configureStore(
      rootReducer,
      {} as AppState,
      middleware,
      enhancers
    )
  }
}
