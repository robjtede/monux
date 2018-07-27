import { NgModule } from '@angular/core'
import {
  LocationStrategy,
  HashLocationStrategy,
  TitleCasePipe
} from '@angular/common'

// primary modules
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { StoreRouterConnectingModule } from '@ngrx/router-store'
import { AppRoutingModule, routedComponents } from './app.routing'

// secondary modules
import { NgxChartsModule } from '@swimlane/ngx-charts'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

// environment
import { environment } from '../environments/environment'

// store
import { reducers, initialState } from './store'
import { effects } from './store/effects'

// directives
import { Autosize } from './directives/autosize.directive'

// pipes
import { CategoryPipe } from './pipes/category.pipe'
import { DeclineReasonPipe } from './pipes/decline-reason.pipe'

// services
import { DomService } from './services/dom.service'
import { ModalService } from './services/modal.service'
import { KeychainService } from './services/keychain.service'
import { CacheService } from './services/cache.service'
import { MonzoService } from './services/monzo.service'

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
import { PotSummaryComponent } from './components/pot-summary.component'
import { CategoryDialogComponent } from './components/category-dialog.component'
import { AttachmentLightboxComponent } from './components/attachment-lightbox.component'
import { BtnComponent } from './components/btn.component'

@NgModule({
  declarations: [
    // components
    RootComponent,
    AmountComponent,
    AccountComponent,
    TransactionListComponent,
    TransactionGroupComponent,
    TransactionSummaryComponent,
    TransactionAttachmentComponent,
    TransactionDetailComponent,
    PotSummaryComponent,
    CategoryDialogComponent,
    AttachmentLightboxComponent,
    BtnComponent,
    // directives
    Autosize,
    // pipes
    CategoryPipe,
    DeclineReasonPipe,
    // router
    ...routedComponents
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
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
    NgxChartsModule,
    FontAwesomeModule
  ],
  providers: [
    // services
    DomService,
    ModalService,
    KeychainService,
    CacheService,
    MonzoService,
    // guards
    ClientInfoGuard,
    ApiAccessGuard,
    // pipes
    TitleCasePipe,
    // custom
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  entryComponents: [CategoryDialogComponent, AttachmentLightboxComponent],
  bootstrap: [RootComponent]
})
export class AppModule {}
