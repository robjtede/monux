// primary modules
import { NgModule } from '@angular/core'
import { AppRoutingModule, routedComponents } from './app.routing'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { StoreRouterConnectingModule } from '@ngrx/router-store'

// secondary modules
import { Ng2ImgToolsModule } from 'ng2-img-tools'

// environment
import { environment } from '../environments/environment'

// store
import { reducers, initialState } from './store'
import { effects } from './store/effects'

// directives
import { Autosize } from './directives/autosize.directive'

// pipes

// services
import { MonzoService } from './services/monzo.service'
import { CacheService } from './services/cache.service'

// guards
import { ClientInfoGuard } from './guards/client-info.guard'
import { ApiAccessGuard } from './guards/api-access.guard'

// components
import { RootComponent } from './components/root.component'
import { AmountComponent } from './components/amount.component'
import { AccountComponent } from './components/account.component'
import { TransactionListComponent } from './components/transaction-list.component'
import { TransactionGroupComponent } from './components/transaction-group.component'
import { TransactionSummaryComponent } from './components/transaction-summary.component'
import { TransactionAttachmentComponent } from './components/transaction-attachment.component'
import { TransactionDetailComponent } from './components/transaction-detail.component'

@NgModule({
  declarations: [
    RootComponent,
    AmountComponent,
    AccountComponent,
    TransactionListComponent,
    TransactionGroupComponent,
    TransactionSummaryComponent,
    TransactionAttachmentComponent,
    TransactionDetailComponent,
    Autosize,
    ...routedComponents
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot(reducers as any, {
      initialState
    }),
    EffectsModule.forRoot(effects),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router'
    }),
    StoreDevtoolsModule.instrument({
      logOnly: environment.production
    }),
    Ng2ImgToolsModule
  ],
  providers: [MonzoService, CacheService, ClientInfoGuard, ApiAccessGuard],
  bootstrap: [RootComponent]
})
export class AppModule {}
