// primary modules
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { StoreModule, ActionReducerMap } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'

// secondary modules
import { Ng2ImgToolsModule } from 'ng2-img-tools'

// environment
import { environment } from '../environments/environment'

// store
import { AppState, reducers, initialState } from './store'
import { effects } from './store/effects'

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
    StoreModule.forRoot(reducers as any, {
      initialState
    }),
    EffectsModule.forRoot(effects),
    StoreDevtoolsModule.instrument({
      logOnly: environment.production
    }),
    Ng2ImgToolsModule
  ],
  providers: [MonzoService, MonzoOldService, CacheOldService, CacheService],
  bootstrap: [AppComponent]
})
export class AppModule {}
